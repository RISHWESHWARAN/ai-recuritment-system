from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
from pathlib import Path


class ResumeMatcher:

    def __init__(self):

        # Load SBERT model
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

        # Dataset path
        BASE_DIR = Path(__file__).resolve().parent.parent
        dataset_path = BASE_DIR / "data" / "Resume.csv"

        # Load CSV
        df_raw = pd.read_csv(dataset_path, header=None)

        # Split the single column into proper columns
        df_split = df_raw[0].str.split(",", expand=True)

        # Use first row as header
        df_split.columns = df_split.iloc[0]
        self.df = df_split[1:].reset_index(drop=True)

        print("Columns detected:", self.df.columns)

        # Ensure resume column exists
        if "resume_text" not in self.df.columns:
            raise ValueError(f"resume_text column missing. Columns found: {self.df.columns}")

        # Remove rows where resume_text is empty
        self.df = self.df[self.df["resume_text"].notna()]

        print("Total resumes:", len(self.df))

        # Convert resume text to list
        self.resumes = self.df["resume_text"].astype(str).tolist()

        print("Generating resume embeddings...")

        # Generate embeddings
        self.resume_embeddings = self.model.encode(
            self.resumes,
            show_progress_bar=True,
            batch_size=64
        )

        print("Embeddings generated successfully.")

    def match(self, job_description):

        job_embedding = self.model.encode([job_description])
        scores = cosine_similarity(job_embedding, self.resume_embeddings)[0]

        self.df["score"] = scores
        ranked = self.df.sort_values(by="score", ascending=False)

        # keep the highest scoring resume for each category
        unique_ranked = ranked.drop_duplicates(subset="category")

        return unique_ranked.head(5)[["category", "score"]]



def calculate_similarity(resume_text: str, job_description: str):
    model = SentenceTransformer("all-MiniLM-L6-v2")

    resume_emb = model.encode([resume_text])
    job_emb = model.encode([job_description])

    score = cosine_similarity(resume_emb, job_emb)[0][0]

    return float(score)