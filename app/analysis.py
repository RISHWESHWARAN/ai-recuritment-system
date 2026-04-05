from services.matcher import ResumeMatcher
import matplotlib.pyplot as plt
import pandas as pd

# Initialize matcher
matcher = ResumeMatcher()

# Job description for testing
job = """
Looking for a machine learning engineer with experience in Python,
TensorFlow, deep learning and machine learning pipelines.
"""

# Get ranked results
results = matcher.match(job)

# -------------------------
# TABLE OUTPUT
# -------------------------
print("\nTop Candidates Table:\n")
print(results)

# -------------------------
# GRAPH OUTPUT
# -------------------------

categories = results["category"]
scores = results["score"]

plt.figure(figsize=(8,5))

plt.bar(categories, scores)

plt.title("Top Resume Similarity Scores")
plt.xlabel("Candidate Category")
plt.ylabel("Cosine Similarity Score")

plt.xticks(rotation=45)

plt.tight_layout()

plt.show()