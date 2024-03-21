from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
import recommendor
import place_func
import rest_recc
import replicate
import json
import nltk
import os
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)

#REPLICATE_API_TOKEN="Your-Token-Here"

REPLICATE_API_TOKEN = os.getenv("Token")

# Global variables to store recommendations data
recommendations_data = {'hotels': None, 'attractions': None, 'restaurants': None}

# Load pickled DataFrames
with open('hotel_dataframe.pkl', 'rb') as f:
    hotel_df = pickle.load(f)

with open('places_dataframe.pkl', 'rb') as f:
    main_df = pickle.load(f)

with open('rest_dataframe.pkl', 'rb') as f:
    restaurant_df = pickle.load(f)


@app.route('/')
def index():
    return render_template('main.html')

@app.route('/get_recommendations', methods=['POST'])
def get_recommendations():
    global recommendations_data  # Access the global variable

    # Get form data
    city = request.form['destination']
    days = request.form['days']
    hotel_features = request.form['hotel-features']
    attraction_features = request.form['attraction-features']
    restaurant_description = request.form['restaurant-description']
    restaurant_locality = request.form['restaurant-locality']
    hotel_price = request.form['hotel-price']

    # Process form data and get recommendations
    hotel_recommendations = recommendor.recommendor(city, hotel_features, hotel_price, hotel_df)
    attraction_recommendations = place_func.requirementbased(city, attraction_features, main_df)
    restaurant_recommendations = rest_recc.rest_recc(city, restaurant_description, restaurant_locality, restaurant_df)
    
    # Check if hotel recommendations are None
    if hotel_recommendations is None:
        # Return a JSON response indicating that the city is not in the database
        return jsonify({'error': f'No hotels recommendations available for {city}. We will update soon. Thank you for your cooperation.'})

    # Process attraction recommendations
    attraction_recommendations = place_func.requirementbased(city, attraction_features, main_df)
    if attraction_recommendations is None:
        # Return a JSON response indicating that attraction recommendations are not available
        return jsonify({'error': f'No attractions recommendations available for {city}. We will update soon. Thank you for your cooperation.'})

    # Process restaurant recommendations
    restaurant_recommendations = rest_recc.rest_recc(city, restaurant_description, restaurant_locality, restaurant_df)
    if restaurant_recommendations is None:
        # Return a JSON response indicating that restaurant recommendations are not available
        return jsonify({'error': f'No restaurants recommendations available for {city}. We will update soon. Thank you for your cooperation.'})

    # Update the global variable with recommendations data
    recommendations_data['hotels'] = hotel_recommendations.to_dict(orient='records')
    recommendations_data['attractions'] = attraction_recommendations.to_dict(orient='records') 
    recommendations_data['restaurants'] = restaurant_recommendations.to_dict(orient='records') 

    # Prepare and return recommendations as JSON response
    iter_data = f'City of travel: {city}, days of travel: {days}, {recommendations_data}'
    client = replicate.Client(api_token=REPLICATE_API_TOKEN)
    output = ""
    if recommendations_data['hotels'] is not None:
        for event in client.stream(
            "mistralai/mixtral-8x7b-instruct-v0.1",
            input={
                "top_k": 50,
                "top_p": 0.9,
                "prompt": "Generate a detailed trip itinerary based on the parsed data, covering the destination in the provided number of days. Ensure that the itinerary includes changing the accommodation for every day and does not exceed the specified number of days, shorten the hotel details. Please provide the number of days for the trip explicitly." + iter_data,
                "temperature": 0.01,
                "max_new_tokens": 1024,
                "prompt_template": "<s>[INST] {prompt} [/INST] ",
                "presence_penalty": 0,
                "frequency_penalty": 0
            },
        ):
            output += str(event)
    iter = json.dumps({"output": output})
    
    return jsonify(recommendations_data,iter)
    # return (output)

@app.route('/about')
def about():
    return render_template('about.html')

if __name__ == '__main__':
    app.run(debug=True)
