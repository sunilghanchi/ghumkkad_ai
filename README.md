# Ghumkkad AI - A Travel Recommendation System

Ghumkkad AI is a comprehensive travel recommendation system that leverages three distinct recommendation engines for hotels, attractions, and restaurants. This system enables users to input their desired destination, days of travel, hotel features, attraction features, restaurant description, restaurant locality, and maximum hotel price. By employing advanced algorithms and machine learning techniques, Ghumkkad AI curates personalized recommendations tailored to individual preferences.

## Features

- **Personalized Recommendations:** Users can input their preferences for destination, hotel features, attraction features, restaurant description, restaurant locality, maximum hotel price, and day of travel to receive tailored recommendations.
- **Itinerary Generation:** Integrated Mistral 7b algorithm generates a comprehensive itinerary based on user inputs, providing a structured plan for the day of travel.
- **Multiple Recommendation Engines:** Ghumkkad AI employs three recommendation engines for hotels, attractions, and restaurants to ensure comprehensive recommendations.
- **Flexibility:** Users have the flexibility to specify additional preferences based on their preferences, enhancing the relevance of recommendations.
- **Streamlined Trip Planning:** By analyzing user inputs and utilizing machine learning techniques, Ghumkkad AI streamlines the trip planning process, delivering top recommendations that match user criteria.
- **Comprehensive Information:** Users receive a comprehensive list of recommendations and a structured itinerary, ensuring an enriched travel experience that meets their specific needs and preferences.

## Components

- **Website Main/app.py:** Flask backend responsible for handling API calls, coordinating recommendation functions, and serving the main website.
- **Website Main/static:** Contains CSS, JavaScript, and other static files for the main website's frontend.
- **Website Main/templates:** HTML files for the main website's frontend.
- **Website Main/recommendation_functions:** Functions related to recommendation algorithms for flask.
- **Website Main/.ipynb notebooks:** Jupyter Notebook files that contain data preprocessing and model training for flask.
- **Website Main/.pkl files:** All pickle files are the preprocessed dataframes for the recommendation function for flask.
- **Streamlit Website/hotel_app.py:** Streamlit web application for interacting with the recommendation system through a user-friendly interface.
- **Streamlit Website/recommendation_functions:** Functions related to recommendation algorithms for the Streamlit app.
- **Streamlit Website/.ipynb notebooks:** Jupyter Notebook files that contain data preprocessing and model training for streamlit.
- **Streamlit Website/.pkl files:** All pickle files are the preprocessed dataframes for the recommendation function for streamlit.
- **Project_datasets.zip:** Contains all the datasets that are used for recommendation.
- **Requirements.txt:** Require libraries to be installed before running this web app. 

## Usage

1. Clone the repository:

```bash
git clone https://github.com/sunilghanchi/ghumkkad_ai.git
cd ghumkkad_ai
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the Flask backend:

```bash
cd "Website Main"
python app.py
```

4. Launch the Streamlit web application:

```bash
cd ../streamlit
streamlit run hotel_app.py
```

5. Access the web application through the provided URLs.

## Deployment

This project is deployed on [On-Render](https://onrender.com/). You can access the deployed version website: [Ghumkkad AI](https://ghumkkad-ai.onrender.com/)

## Contributors

- [Sunil Ghanchi](https://github.com/sunilghanchi)
- Contributions to the project are welcome! If you encounter any issues or have suggestions for improvement, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
