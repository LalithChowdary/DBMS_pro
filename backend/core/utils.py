import nltk
import ssl

def setup_nltk():
    """
    Ensure required NLTK resources are installed, handling SSL on some systems.
    Prefer running this once during environment setup (not on every app start).
    """
    resources = {
        "punkt": "tokenizers/punkt",
        "stopwords": "corpora/stopwords",
        "wordnet": "corpora/wordnet",
        "averaged_perceptron_tagger": "taggers/averaged_perceptron_tagger",
    }

    try:
        _create_unverified_https_context = ssl._create_unverified_context
    except AttributeError:
        pass
    else:
        ssl._create_default_https_context = _create_unverified_https_context

    for pkg, resource_path in resources.items():
        try:
            nltk.data.find(resource_path)
            print(f"NLTK package: {pkg} is already installed.")
        except LookupError:
            print(f"Downloading NLTK package: {pkg}...")
            nltk.download(pkg, quiet=True)

if __name__ == '__main__':
    setup_nltk()
    print("NLTK setup complete.")