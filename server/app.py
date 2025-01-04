import astrapy
from astrapy import DataAPIClient
from langchain_openai import OpenAI  # Correct import statement for OpenAI
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from flask import Flask, request, jsonify,send_from_directory
from flask_cors import CORS
import os
import json
import re
from dotenv import load_dotenv
import random
import string

load_dotenv()
app = Flask(__name__, static_folder='../client/dist', static_url_path='')
CORS(app)

# Initialize the client and connect to the database
client = DataAPIClient(os.getenv('ASTRADB'))
db = client.get_database_by_api_endpoint(
    os.getenv('ENDPOINT')
)
def generate_unique_id(length=8):
    # Generate a unique ID with characters between a-z
    return ''.join(random.choices(string.ascii_lowercase, k=length))

def analyze(data, postType):
    
    unique_id = generate_unique_id()

    db.create_collection(unique_id)
    print(f"Created collection: {unique_id}")

    collection = db[unique_id]
    collection.insert_many(data) 


    try:
        # Fetch all documents from the collection
        documents = collection.find({})

        # Initialize counters
        metrics = {}
        for doc in documents:
            post_type = doc['post_type']
            if post_type not in metrics:
                metrics[post_type] = {"likes": 0, "shares": 0, "comments": 0, "count": 0}
            
            metrics[post_type]["likes"] += doc.get("likes", 0)
            metrics[post_type]["shares"] += doc.get("shares", 0)
            metrics[post_type]["comments"] += doc.get("comments", 0)
            metrics[post_type]["count"] += 1
        
        metrics_data = {}
        
        # Calculate averages
        for post_type, values in metrics.items():
            avg_likes = values["likes"] / values["count"]
            avg_shares = values["shares"] / values["count"]
            avg_comments = values["comments"] / values["count"]
            metrics_data[post_type] = {
                "averageLikes": avg_likes,
                "averageShares": avg_shares,
                "averageComments": avg_comments
            }
        
        # Prompt template for the analysis
        prompt = PromptTemplate(
            template=""" 
            {data}
            Analyze the provided JSON average engagement data of(like,shares,comments) for Instagram post types (e.g., static post, carousel, reel). Compare the metrics for {postType} with other post types. The output should be in JSON format, structured as follows:
            "insights": 
                "1-{postType}_vs_<anotherPostType>": 
                    "likes_difference": "<comparision>",
                    "shares_difference": "<comparision>",
                    "comments_difference": "<comparision>"
                ,
                "2-{postType}_vs_<anotherPostType>": 
                    "likes_difference": "<comparision>",
                    "shares_difference": "<comparision>",
                    "comments_difference": "<comparision>"
                ,
                "3-overall_engagement": 
                    "{postType}_vs_<anotherPostType>": "<summary>",
                    "{postType}_vs_<anotherPostType>": "<summary>"
            Provide comparisons in a humanized way, e.g., "Carousel posts have 20% higher engagement than static posts," and return only the JSON data.""",
            input_variables=["data","postType"]
        )

        # Initialize the OpenAI model
        llm = ChatOpenAI(model="gpt-4o-mini", api_key=os.getenv('OPENAIKEY'))  # Use the correct model name for OpenAI GPT-4

        # Chain the prompt and LLM using the pipe operator
        chain = prompt | llm

        try:
            # Get response from the chain
            response = chain.invoke(input={"data": metrics_data,"postType":postType})
           
            response_content = response.content  # Extract content of the AI message
            json_part = re.sub(r"```json|```", "", response_content )
                
            # Return the response as JSON
            return json_part, 200

           
           
            
        except Exception as e:
            print(f"An error occurred during analysis: {e}")
            return {"status": "error", "message": str(e)}

    except Exception as e:
        print(f"An error occurred while fetching data from the database: {e}")
        return {"status": "error", "message": str(e)}

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        # Get the file from the request
        file = request.files['file']
        postType=request.form['postType']
    

        # Read the file content
        file_content = file.read().decode('utf-8').splitlines()

        # Join the lines to form a valid JSON string
        json_data = ''.join(file_content)
        
        try:
            # Parse the JSON data
            data = json.loads(json_data)
            response = analyze(data, postType)
            return jsonify(response), 200
        except json.JSONDecodeError as e:
            return jsonify({"status": "error", "message": f"Failed to decode JSON: {str(e)}"}), 400
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
