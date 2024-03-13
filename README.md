# Ghumkkad AI - A Travel Recommendation System

Ghumkkad AI is a comprehensive travel recommendation system that leverages three distinct recommendation engines for hotels, attractions, and restaurants. This system enables users to input their desired destination, hotel features, attraction features, restaurant description, restaurant locality, and maximum hotel price. By employing advanced algorithms and machine learning techniques, Ghumkkad AI curates personalized recommendations tailored to individual preferences.

## Features

- **Personalized Recommendations:** Users can input their preferences for destination, hotel features, attraction features, restaurant description, restaurant locality, and maximum hotel price to receive tailored recommendations.
- **Multiple Recommendation Engines:** Ghumkkad AI employs three recommendation engines for hotels, attractions, and restaurants to ensure comprehensive recommendations.
- **Flexibility:** Users have the flexibility to specify additional preferences based on their preferences, enhancing the relevance of recommendations.
- **Streamlined Trip Planning:** By analyzing user inputs and utilizing machine learning techniques, Ghumkkad AI streamlines the trip planning process, delivering top recommendations that match user criteria.
- **Comprehensive Information:** Users receive a comprehensive list of recommendations, ensuring an enriched travel experience that meets their specific needs and preferences.

## Components

- **website/main/app.py:** Flask backend responsible for handling API calls, coordinating recommendation functions, and serving the main website.
- **website/main/static:** Contains CSS, JavaScript, and other static files for the main website's frontend.
- **website/main/templates:** HTML files for the main website's frontend.
- **website/main/recommendation_functions:** Functions related to recommendation algorithms.
- **website/main/ipynb_notebooks:** Jupyter Notebook files for data preprocessing and model training.
- **website/main/pickle_files:** Contains all pickle files used by the recommendation functions.
- **streamlit/hotel_app.py:** Streamlit web application for interacting with the recommendation system through a user-friendly interface.
- **streamlit/recommendation_functions:** Functions related to recommendation algorithms for the Streamlit app.
- **streamlit/ipynb_notebooks:** Jupyter Notebook files for data preprocessing and model training for the Streamlit app.
- **streamlit/pickle_files:** Contains all pickle files used by the recommendation functions for the Streamlit app.

## Usage

1. Clone the repository:

```bash
git clone https://github.com/your-username/ghumkkad-ai.git
cd ghumkkad-ai
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the Flask backend:

```bash
cd website/main
python app.py
```

4. Launch the Streamlit web application:

```bash
cd ../streamlit
streamlit run hotel_app.py
```

5. Access the web application through the provided URLs.

## Deployment

This project is deployed on [Heroku](https://www.heroku.com/) using [On-Render](https://onrender.com/). You can access the deployed version [here](#) (provide link to your deployed application).

## Contributors

- [Sunil Ghanchi](https://github.com/sunilghanchi)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
