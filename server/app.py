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
import uuid

from dotenv import load_dotenv
from datetime import datetime
import random
import string


load_dotenv()
app = Flask(__name__, static_folder='../client/dist', static_url_path='')
CORS(app)


client = DataAPIClient(os.getenv('ASTRADB'))
db = client.get_database_by_api_endpoint(
  os.getenv('ENDPOINT')
)
def generate_unique_id(length=8):
    # Generate a unique ID with characters between a-z
    return ''.join(random.choices(string.ascii_lowercase, k=length))

def analyze(postType,date,dataset):
    
    # unique_id = generate_unique_id()

    # db.create_collection(unique_id)
    # print(f"Created collection: {unique_id}")

    # collection = db[unique_id]
    # collection.insert_many(data) 
    collections=db[dataset]

    try:
        # Fetch all documents from the collection
        documents = collections.find({})
        # documents1=collections.find({})
        # Initialize counters
        metrics = {}
        filterData = []
        for doc in documents:
            if(doc["post_type"]==postType and doc['post_Date']==date):
                filterData.append(doc)
            if(doc['post_Date']==date):
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
                "{postType}_vs_<anotherPostType>": 
                    "likes_difference": "<comparision>",
                    "shares_difference": "<comparision>",
                    "comments_difference": "<comparision>"
                ,
                "{postType}_vs_<anotherPostType>": 
                    "likes_difference": "<comparision>",
                    "shares_difference": "<comparision>",
                    "comments_difference": "<comparision>"
                ,
                "overall_engagement": 
                    "{postType}_vs_<anotherPostType>": "<summary>",
                    "{postType}_vs_<anotherPostType>": "<summary>"
            Provide comparisons in a humanized way, e.g., "Carousel posts have 20% higher engagement than static posts," and return only the JSON data. Note- Do not assign any sign to and difference (positive or negative)""",
            input_variables=["data","postType"]
        )

       
        # Initialize the OpenAI model
        llm = ChatOpenAI(model="gpt-4o-mini", api_key=os.getenv('OPENAIKEY'))  # Use the correct model name for OpenAI GPT-4

        # Chain the prompt and LLM using the pipe operator
        chain = prompt | llm
        # chain1= prompt1 | llm
        try:
            # Get response from the chain
            response = chain.invoke(input={"data": metrics_data,"postType":postType})
           
            response_content = response.content  # Extract content of the AI message
            json_part = re.sub(r"```json|```", "", response_content )
            
            # Return the response as JSON
            return {"filterData":filterData,'comparision':json_part,'msg':1}
        except Exception as e:
            
            return {"msg": 0}

    except Exception as e:
        
        return {"msg": 0}

@app.route('/')
def serve():
    # Serve the index.html for any route not found on the server
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/averageEngagementMetrics/<datasetName>/<date>')
def AverageEngagementMetrics(datasetName,date):
    collections=db[datasetName]

    
    # Fetch all documents from the collection
    documents = collections.find({})
    # documents1=collections.find({})
    # Initialize counters
    metrics = {}
    for doc in documents:
        if(doc['post_Date']==date):
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
        
    return metrics_data

@app.route('/userdata')
def userdata():
    # Serve the index.html for any route not found on the server
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/overallAnalytics')
def overallAnalytics():
    # Serve the index.html for any route not found on the server
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/comparisionAnalytics')
def comparisionAnalytics():
    # Serve the index.html for any route not found on the server
    return send_from_directory(app.static_folder, 'index.html')




def nameOfFiles():
    response = db.list_collections()
    fileNames=[]
    for file in response:
        fileNames.append(file.name)
 
    # collections = [collection['name'] for collection in response.get('data', [])]
    
    # Return as JSON
    return fileNames

@app.route('/fileNames')
def filenames():
    return nameOfFiles()


@app.route('/viewData/<dataset>')
def viewDataset(dataset):
    collection=db[dataset]
    documents = collection.find({})
    data=[]
    for doc in documents:
        data.append(doc)
    return data

@app.route('/deleteDataset/<datasetName>')
def deleteDataset(datasetName):
    response=db.drop_collection(datasetName)
    return response

@app.route('/engagementData/<dataset>', methods=['GET', 'POST'])
def sendData(dataset):
    collections = db[dataset]
    
    # Fetch only the required fields to reduce data transfer
    documents = collections.find({})
    
    metrics = {}
    actualData = []
    totalData={}
    
    for doc in documents:
        # Add the document to the actual data list
        actualData.append(doc)
        
        # Get post type and post date
        post_type = doc.get("post_type")
        post_date = doc.get("post_Date")
        
        # Ensure the post_type exists in totalData
        if post_type not in totalData:
            totalData[post_type] = {'likes': 0, 'shares': 0, 'comments': 0}
        
        # Safely update totals
        totalData[post_type]['likes'] += doc.get('likes', 0)
        totalData[post_type]['shares'] += doc.get('shares', 0)
        totalData[post_type]['comments'] += doc.get('comments', 0)

        # Initialize nested dictionaries using setdefault
        post_metrics = metrics.setdefault(post_type, {}).setdefault(post_date, {
            "likes": 0,
            "shares": 0,
            "comments": 0,
            "count": 0
        })

        # Update metrics
        post_metrics["likes"] += doc.get("likes", 0)
        post_metrics["shares"] += doc.get("shares", 0)
        post_metrics["comments"] += doc.get("comments", 0)
        post_metrics["count"] += 1
    print(totalData)

    # Calculate averages
    metrics_data = {
        post_type: {
            post_date: {
                "averageLikes": values["likes"] / values["count"],
                "averageShares": values["shares"] / values["count"],
                "averageComments": values["comments"] / values["count"]
            }
            for post_date, values in date_metrics.items()
        }
        for post_type, date_metrics in metrics.items()
    }

    return {"actualData": actualData, "metricsData": metrics_data, "totalData":totalData}


@app.route('/uploadFile',methods=['POST'])
def uploadFile():
    file = request.files['file']
    filename_with_extension = file.filename
    filename_without_extension = os.path.splitext(filename_with_extension)[0]
    files=nameOfFiles()
    if len(files)==7:
        return {"msg":"You Exceed Your Maximum limit of uploading files"}
    file_content = file.read().decode('utf-8').splitlines()
    json_data = ''.join(file_content)

    try:
        # Parse the JSON data
        data = json.loads(json_data)
        
        # Check if data is a list
        if not isinstance(data, list):
            return {"msg": "Uploaded data must be a list of objects."}

        # Validate each object in the list
        required_keys = {"post_id", "post_type", "post_Date", "likes", "shares", "comments"}
        for obj in data:
            # Check if obj is a dictionary
            if not isinstance(obj, dict):
                return {"msg": "Each item in the list must be an object."}

            # Check if all required keys are present and not empty
            if required_keys != obj.keys():
                
                return {"msg": f"Invalid structure in object: {obj}. Expected keys: {required_keys}"}

            # Additional type checks (e.g., likes, shares, comments must be integers)
            if not all(isinstance(obj[key], (int, str)) for key in ["likes", "shares", "comments"]):
                return {"msg": f"Invalid data types in object: {obj}. 'likes', 'shares', 'comments' must be integers."}

        # Create a collection and insert data
        db.create_collection(filename_without_extension)
        collection = db[filename_without_extension]
        collection.insert_many(data)
        return {"msg": 1}, 200

    except json.JSONDecodeError:
        return {"msg": "Invalid JSON format."}
    except Exception as e:
        return {"msg": f"An error occurred: {str(e)}"}

@app.route('/upload', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        # Get the file from the request
        # file = request.files['file']
        postType=request.form['postType']
        date=request.form['date']
        dataset=request.form['dataset']

        # Read the file content
        # file_content = file.read().decode('utf-8').splitlines()

        # Join the lines to form a valid JSON string
        # json_data = ''.join(file_content)
        
        try:
            # Parse the JSON data
            # data = json.loads(json_data)
            response = analyze(postType,date,dataset)
            return jsonify(response), 200
        except json.JSONDecodeError as e:
            return {"msg": 0}

if __name__ == '__main__':
  app.run(host="0.0.0.0", port=5000)
