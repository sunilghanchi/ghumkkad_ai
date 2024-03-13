import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords



def rest_recc(city, description, locality, df):
    df['City'] = df['City'].str.lower()
    df['Description'] = df['Description'].str.lower()
    df['Address'] = df['Address'].str.lower()

    if description:
        description = description.lower()
        description_tokens = word_tokenize(description)
        sw = stopwords.words('english')
        lemm = WordNetLemmatizer()
        f1_set = {w for w in description_tokens if not w in sw}
        f_set = set()
        for se in f1_set:
            f_set.add(lemm.lemmatize(se))

    req_based = df[df['City'] == city.lower()]

    if req_based.empty:
        print("No attractions data found for this city.")
        return None

    if description:
        cos_desc = []
        for i in range(req_based.shape[0]):
            temp_tokens = word_tokenize(req_based['Description'].iloc[i])
            temp1_set = {w for w in temp_tokens if not w in sw}
            temp_set = set()
            for se in temp1_set:
                temp_set.add(lemm.lemmatize(se))
            revector = temp_set.intersection(f_set)
            cos_desc.append(len(revector))

        req_based['Desc_Similarity'] = cos_desc
    else:
        req_based['Desc_Similarity'] = 0

    if locality:
        locality = locality.lower()
        sw = stopwords.words('english')
        lemm = WordNetLemmatizer()
        locality_tokens = word_tokenize(locality)
        f1_set = {w for w in locality_tokens if not w in sw}
        locality_set = set()
        for se in f1_set:
            locality_set.add(lemm.lemmatize(se))

        cos_locality = []
        for i in range(req_based.shape[0]):
            temp_tokens = word_tokenize(req_based['Address'].iloc[i])
            temp1_set = {w for w in temp_tokens if not w in sw}
            temp_set = set()
            for se in temp1_set:
                temp_set.add(lemm.lemmatize(se))
            revector = temp_set.intersection(locality_set)
            cos_locality.append(len(revector))

        req_based['Locality_Similarity'] = cos_locality
    else:
        req_based['Locality_Similarity'] = 0

    req_based['Total_Similarity'] = req_based['Desc_Similarity'] + req_based['Locality_Similarity']

    # Weight for balancing rating and similarity
    rating_weight = 0.5
    locality_weight = 0.5

    # Calculate weighted score
    req_based['Weighted_Score'] = (req_based['Rating'] * rating_weight) + (req_based['Locality_Similarity'] * locality_weight)

    # Sort by weighted score and reset index
    req_based = req_based.sort_values(by='Weighted_Score', ascending=False).reset_index(drop=True)

    return req_based[['Name', 'Type', 'Cuisines', 'Highlights', 'Address', 'Rating', 'Cost for Two', 'Timings', 'Weighted_Score']].head(10)
