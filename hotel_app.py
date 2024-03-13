import streamlit as st
import pandas as pd
import pickle
import recommendor
import place_func
import rest_recc

# Load pickled DataFrames
with open('hotel_dataframe.pkl', 'rb') as f:
    hotel_df = pickle.load(f)

with open('places_dataframe.pkl', 'rb') as f:
    main_df = pickle.load(f)

with open('rest_dataframe.pkl', 'rb') as f:
    restaurant_df = pickle.load(f)

# Page Configurations
st.set_page_config(page_title="Ghummkad AI", page_icon="🌍")

# Website Image
st.image("10001.png", use_column_width=True)

# Title and Description
st.title("Ghummkad AI: Your Travel Recommendation Companion")
st.markdown("""
Discover your next travel adventure with Ghummkad AI! Explore personalized hotel, attraction, and restaurant recommendations based on your preferences.
""")

# User Inputs
city = st.text_input("Enter the city:")
hotel_features = st.text_input("Enter desired hotel features:")
attraction_features = st.text_input("Enter desired attractions:")
restaurant_description = st.text_input("Enter desired restaurant description:")
restaurant_locality = st.text_input("Enter desired restaurant locality:")
hotel_price = st.number_input("Enter maximum hotel price:")

# Get Recommendations Button
if st.button("Get Recommendations"):
    hotel_recommendations = recommendor.recommendor(city, hotel_features, hotel_price, hotel_df)
    attraction_recommendations = place_func.requirementbased(city, attraction_features, main_df)
    restaurant_recommendations = rest_recc.rest_recc(city, restaurant_description, restaurant_locality, restaurant_df)

    # Display recommendations
    if city.lower() not in hotel_df['City'].str.lower().unique():
        st.write(f"No data available for {city.title()}!! Sorry for this issue we will try to upgrade our database, Thank you for your Cooperation! ")
    else:
        if not hotel_recommendations.empty:
            st.write("### Hotel Recommendations:")
            for index, row in hotel_recommendations.iterrows():
                expander_text = f"{row['Name'].title()}"
                with st.expander(expander_text):
                    st.write(f"Price: {row['Price']} Rs/Night")
                    st.write(f"Address: {row['Address']}")
                    st.write(f"Rating: {row['Review_Score']}")
                    st.write(f"Amenities: {row['Amenities']}")
                    goibibo_link = f"[Goibibo Link for {row['Name']}](https://www.goibibo.com/hotels/)"
                    st.markdown(goibibo_link)
        else:
            st.write(f"No hotel recommendations found for the city: {city}")

        if not attraction_recommendations.empty:
            st.write("### Attraction Recommendations:")
            for index, row in attraction_recommendations.iterrows():
                expander_text = f"{row['Place'].title()}"
                with st.expander(expander_text):
                    st.write(f"City: {row['City'].title()}")
                    st.write(f"Rating: {row['Rating']}")
                    st.write(f"Description: {row['Description']}")
        else:
            st.write(f"No attractions found for the city: {city}")

        if not restaurant_recommendations.empty:
            st.write("### Restaurant Recommendations:")
            for index, row in restaurant_recommendations.iterrows():
                expander_text = f"{row['Name'].title()}"
                with st.expander(expander_text):
                    st.write(f"Type: {row['Type']}")
                    st.write(f"Cuisine: {row['Cuisines']}")
                    st.write(f"Highlights: {row['Highlights']}")
                    st.write(f"Rating: {row['Rating']}")
                    st.write(f"Cost for Two Person: {row['Cost for Two']}")
                    st.write(f"Address: {row['Address']}")
                    st.write(f"Timings: {row['Timings']}")
        else:
            st.write(f"No restaurants found for the city: {city}")

# About the AI
st.markdown("""
### About Ghummkad AI:
Ghummkad AI is your ultimate travel companion, designed to provide personalized recommendations based on your preferences. Whether you're searching for the perfect hotel, exploring top attractions, or discovering the best dining spots, Ghummkad AI has got you covered! Start your next adventure with Ghummkad AI today!
""")
