from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
import recommendor
import place_func
import rest_recc
import nltk
nltk.download(‘punkt’)
nltk.download('stopwords')
nltk.download('wordnet')

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)

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
    # Get form data
    city = request.form['destination']
    hotel_features = request.form['hotel_features']
    attraction_features = request.form['attraction_features']
    restaurant_description = request.form['restaurant_description']
    restaurant_locality = request.form['restaurant_locality']
    hotel_price = request.form['hotel_price']

    # Process form data and get hotel recommendations
    hotel_recommendations = recommendor.recommendor(city, hotel_features, hotel_price, hotel_df)

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

    # Prepare recommendations data
    hotel_data = hotel_recommendations.to_dict(orient='records')
    attraction_data = attraction_recommendations.to_dict(orient='records')
    restaurant_data = restaurant_recommendations.to_dict(orient='records')

    # Return recommendations as JSON response
    return jsonify({'hotels': hotel_data, 'attractions': attraction_data, 'restaurants': restaurant_data})

@app.route('/about')
def about():
    return render_template('about.html')

if __name__ == '__main__':
    app.run(debug=True)
