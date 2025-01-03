import astrapy
from astrapy import DataAPIClient
from langchain_openai import OpenAI  # Correct import statement for OpenAI
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import re
from dotenv import load_dotenv
from waitress import serve
# from app import app

print(astrapy.__version__)
load_dotenv()
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

# Initialize the client and connect to the database
client = DataAPIClient(os.getenv('ASTRADB'))
db = client.get_database_by_api_endpoint(
    os.getenv('ENDPOINT')
)

def analyze(data, filename):
    
    existing_collections = db.list_collections()
    collection_name = filename
    if collection_name not in existing_collections:
        db.create_collection(collection_name)
        print(f"Created collection: {collection_name}")
    else:
        print(f"Collection already exists: {collection_name}")

    collection = db[filename]
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
            This is the input in the form of json format which includes the average engagement metrics for instagram post type 
            (e.g. static post, carousel, reel). Your task is to analyze the data and provide insight into the data compared to carousel data in a humanized way.
            Example: Carousel posts have 20% higher engagement than static posts, Reels drive 2x more comments compared to other formats. etc.Give the output in JSON format in the form
            insights: 
            static_vs_reel: 
                likes_difference: ,
                shares_difference: ,
                comments_difference: 
            ,
            carousel_vs_reel: 
                likes_difference: ,
                shares_difference: ,
                comments_difference: 
            ,
            overall_engagement: 
                carousel_vs_static: ,
                reel_vs_static: 
            In Humanize way and only return the json data""",
            input_variables=["data"]
        )

        # Initialize the OpenAI model
        llm = ChatOpenAI(model="gpt-4o-mini", api_key=os.getenv('OPENAIKEY'))  # Use the correct model name for OpenAI GPT-4

        # Chain the prompt and LLM using the pipe operator
        chain = prompt | llm

        try:
            # Get response from the chain
            response = chain.invoke(input={"data": metrics_data})
           
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


@app.route('/upload', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        # Get the file from the request
        file = request.files['file']
        filename = os.path.splitext(file.filename)[0]

        # Read the file content
        file_content = file.read().decode('utf-8').splitlines()

        # Join the lines to form a valid JSON string
        json_data = ''.join(file_content)
        
        try:
            # Parse the JSON data
            data = json.loads(json_data)
            response = analyze(data, filename)
            return jsonify(response), 200
        except json.JSONDecodeError as e:
            return jsonify({"status": "error", "message": f"Failed to decode JSON: {str(e)}"}), 400


# if __name__ == '__main__':
#     app.run()
serve(app, host='0.0.0.0', port=8080)
