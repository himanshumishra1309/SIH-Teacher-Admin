import mongoose, { Schema } from "mongoose";

const pointSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    domain: {
      type: String,
      required: true,
      enum: [
        "Nature (book)",
          "IEEE/CVF Conference on Computer Vision and Pattern Recognition (book)",
          "The New England Journal of Medicine (book)",
          "Science (book)",
          "Nature Communications (book)",
          "The Lancet (book)",
          "Neural Information Processing Systems (book)",
          "Advanced Materials (book)",
          "Cell (book)",
          "International Conference on Learning Representations (book)",
          "JAMA (book)",
          "Science of The Total Environment (book)",
          "IEEE/CVF International Conference on Computer Vision (book)",
          "Angewandte Chemie International Edition (book)",
          "Nature Medicine (book)",
          "Journal of Cleaner Production (book)",
          "International Conference on Machine Learning (book)",
          "Chemical Reviews (book)",
          "Proceedings of the National Academy of Sciences (book)",
          "IEEE Access (book)",
          "Chemical Society Reviews (book)",
          "International Journal of Molecular Sciences (book)",
          "Advanced Functional Materials (book)",
          "Advanced Energy Materials (book)",
          "Journal of the American Chemical Society (book)",
          "Nucleic Acids Research (book)",
          "Chemical Engineering Journal (book)",
          "International Journal of Environmental Research and Public Health (book)",
          "PLOS ONE (book)",
          "BMJ (book)",
          "Science Advances (book)",
          "Sustainability (book)",
          "ACS Nano (book)",
          "Scientific Reports (book)",
          "AAAI Conference on Artificial Intelligence (book)",
          "Meeting of the Association for Computational Linguistics (ACL) (book)",
          "Frontiers in Immunology (book)",
          "Journal of Clinical Oncology (book)",
          "Energy & Environmental Science (book)",
          "Physical Review Letters (book)",
          "Applied Catalysis B: Environmental (book)",
          "Circulation (book)",
          "Journal of Business Research (book)",
          "Nutrients (book)",
          "Renewable and Sustainable Energy Reviews (book)",
          "European Conference on Computer Vision (book)",
          "The Lancet Oncology (book)",
          "Journal of Hazardous Materials (book)",
          "IEEE Transactions on Pattern Analysis and Machine Intelligence (book)",
          "Morbidity and Mortality Weekly Report (book)",
          "Conference on Empirical Methods in Natural Language Processing (EMNLP) (book)",
          "Nature Biotechnology (book)",
          "Journal of the American College of Cardiology (book)",
          "Sensors (book)",
          "Nature Materials (book)",
          "Applied Energy (book)",
          "Nano Energy (book)",
          "Nature Genetics (book)",
          "Joule (book)",
          "Technological Forecasting and Social Change (book)",
          "IEEE Internet of Things Journal (book)",
          "Frontiers in Psychology (book)",
          "Molecules (book)",
          "Journal of Materials Chemistry A (book)",
          "Environmental Science & Technology (book)",
          "Chemosphere (book)",
          "The Lancet Infectious Diseases (book)",
          "JAMA Network Open (book)",
          "ACS Applied Materials & Interfaces (book)",
          "Clinical Infectious Diseases (book)",
          "Nature Energy (book)",
          "Gastroenterology (book)",
          "ACS Catalysis (book)",
          "Advanced Science (book)",
          "Nature Nanotechnology (book)",
          "Annals of Oncology (book)",
          "Gut (book)",
          "Journal of Environmental Management (book)",
          "Molecular Cancer (book)",
          "European Heart Journal (book)",
          "Physical Review D (book)",
          "Nature Methods (book)",
          "Environmental Pollution (book)",
          "The Astrophysical Journal (book)",
          "IEEE Transactions on Industrial Informatics (book)",
          "ACS Energy Letters (book)",
          "Immunity (book)",
          "International Journal of Information Management (book)",
          "Cells (book)",
          "Expert Systems with Applications (book)",
          "Water Research (book)",
          "Applied Sciences (book)",
          "Energy (book)",
          "Small (book)",
          "Environmental Science and Pollution Research (book)",
          "Renewable Energy (book)",
          "Bioresource Technology (book)",
          "Nature Reviews Immunology (book)",
          "Energy Storage Materials (book)",
          "Coordination Chemistry Reviews (book)",
          "Nature (journal)",
          "IEEE/CVF Conference on Computer Vision and Pattern Recognition (journal)",
          "The New England Journal of Medicine (journal)",
          "Science (journal)",
          "Nature Communications (journal)",
          "The Lancet (journal)",
          "Neural Information Processing Systems (journal)",
          "Advanced Materials (journal)",
          "Cell (journal)",
          "International Conference on Learning Representations (journal)",
          "JAMA (journal)",
          "Science of The Total Environment (journal)",
          "IEEE/CVF International Conference on Computer Vision (journal)",
          "Angewandte Chemie International Edition (journal)",
          "Nature Medicine (journal)",
          "Journal of Cleaner Production (journal)",
          "International Conference on Machine Learning (journal)",
          "Chemical Reviews (journal)",
          "Proceedings of the National Academy of Sciences (journal)",
          "IEEE Access (journal)",
          "Chemical Society Reviews (journal)",
          "International Journal of Molecular Sciences (journal)",
          "Advanced Functional Materials (journal)",
          "Advanced Energy Materials (journal)",
          "Journal of the American Chemical Society (journal)",
          "Nucleic Acids Research (journal)",
          "Chemical Engineering Journal (journal)",
          "International Journal of Environmental Research and Public Health (journal)",
          "PLOS ONE (journal)",
          "BMJ (journal)",
          "Science Advances (journal)",
          "Sustainability (journal)",
          "ACS Nano (journal)",
          "Scientific Reports (journal)",
          "AAAI Conference on Artificial Intelligence (journal)",
          "Meeting of the Association for Computational Linguistics (ACL) (journal)",
          "Frontiers in Immunology (journal)",
          "Journal of Clinical Oncology (journal)",
          "Energy & Environmental Science (journal)",
          "Physical Review Letters (journal)",
          "Applied Catalysis B: Environmental (journal)",
          "Circulation (journal)",
          "Journal of Business Research (journal)",
          "Nutrients (journal)",
          "Renewable and Sustainable Energy Reviews (journal)",
          "European Conference on Computer Vision (journal)",
          "The Lancet Oncology (journal)",
          "Journal of Hazardous Materials (journal)",
          "IEEE Transactions on Pattern Analysis and Machine Intelligence (journal)",
          "Morbidity and Mortality Weekly Report (journal)",
          "Conference on Empirical Methods in Natural Language Processing (EMNLP) (journal)",
          "Nature Biotechnology (journal)",
          "Journal of the American College of Cardiology (journal)",
          "Sensors (journal)",
          "Nature Materials (journal)",
          "Applied Energy (journal)",
          "Nano Energy (journal)",
          "Nature Genetics (journal)",
          "Joule (journal)",
          "Technological Forecasting and Social Change (journal)",
          "IEEE Internet of Things Journal (journal)",
          "Frontiers in Psychology (journal)",
          "Molecules (journal)",
          "Journal of Materials Chemistry A (journal)",
          "Environmental Science & Technology (journal)",
          "Chemosphere (journal)",
          "The Lancet Infectious Diseases (journal)",
          "JAMA Network Open (journal)",
          "ACS Applied Materials & Interfaces (journal)",
          "Clinical Infectious Diseases (journal)",
          "Nature Energy (journal)",
          "Gastroenterology (journal)",
          "ACS Catalysis (journal)",
          "Advanced Science (journal)",
          "Nature Nanotechnology (journal)",
          "Annals of Oncology (journal)",
          "Gut (journal)",
          "Journal of Environmental Management (journal)",
          "Molecular Cancer (journal)",
          "European Heart Journal (journal)",
          "Physical Review D (journal)",
          "Nature Methods (journal)",
          "Environmental Pollution (journal)",
          "The Astrophysical Journal (journal)",
          "IEEE Transactions on Industrial Informatics (journal)",
          "ACS Energy Letters (journal)",
          "Immunity (journal)",
          "International Journal of Information Management (journal)",
          "Cells (journal)",
          "Expert Systems with Applications (journal)",
          "Water Research (journal)",
          "Applied Sciences (journal)",
          "Energy (journal)",
          "Small (journal)",
          "Environmental Science and Pollution Research (journal)",
          "Renewable Energy (journal)",
          "Bioresource Technology (journal)",
          "Nature Reviews Immunology (journal)",
          "Energy Storage Materials (journal)",
          "Coordination Chemistry Reviews (journal)",
            "Nature (patent)",
            "IEEE/CVF Conference on Computer Vision and Pattern Recognition (patent)",
            "The New England Journal of Medicine (patent)",
            "Science (patent)",
            "Nature Communications (patent)",
            "The Lancet (patent)",
            "Neural Information Processing Systems (patent)",
            "Advanced Materials (patent)",
            "Cell (patent)",
            "International Conference on Learning Representations (patent)",
            "JAMA (patent)",
            "Science of The Total Environment (patent)",
            "IEEE/CVF International Conference on Computer Vision (patent)",
            "Angewandte Chemie International Edition (patent)",
            "Nature Medicine (patent)",
            "Journal of Cleaner Production (patent)",
            "International Conference on Machine Learning (patent)",
            "Chemical Reviews (patent)",
            "Proceedings of the National Academy of Sciences (patent)",
            "IEEE Access (patent)",
            "Chemical Society Reviews (patent)",
            "International Journal of Molecular Sciences (patent)",
            "Advanced Functional Materials (patent)",
            "Advanced Energy Materials (patent)",
            "Journal of the American Chemical Society (patent)",
            "Nucleic Acids Research (patent)",
            "Chemical Engineering Journal (patent)",
            "International Journal of Environmental Research and Public Health (patent)",
            "PLOS ONE (patent)",
            "BMJ (patent)",
            "Science Advances (patent)",
            "Sustainability (patent)",
            "ACS Nano (patent)",
            "Scientific Reports (patent)",
            "AAAI Conference on Artificial Intelligence (patent)",
            "Meeting of the Association for Computational Linguistics (ACL) (patent)",
            "Frontiers in Immunology (patent)",
            "Journal of Clinical Oncology (patent)",
            "Energy & Environmental Science (patent)",
            "Physical Review Letters (patent)",
            "Applied Catalysis B: Environmental (patent)",
            "Circulation (patent)",
            "Journal of Business Research (patent)",
            "Nutrients (patent)",
            "Renewable and Sustainable Energy Reviews (patent)",
            "European Conference on Computer Vision (patent)",
            "The Lancet Oncology (patent)",
            "Journal of Hazardous Materials (patent)",
            "IEEE Transactions on Pattern Analysis and Machine Intelligence (patent)",
            "Morbidity and Mortality Weekly Report (patent)",
            "Conference on Empirical Methods in Natural Language Processing (EMNLP) (patent)",
            "Nature Biotechnology (patent)",
            "Journal of the American College of Cardiology (patent)",
            "Sensors (patent)",
            "Nature Materials (patent)",
            "Applied Energy (patent)",
            "Nano Energy (patent)",
            "Nature Genetics (patent)",
            "Joule (patent)",
            "Technological Forecasting and Social Change (patent)",
            "IEEE Internet of Things Journal (patent)",
            "Frontiers in Psychology (patent)",
            "Molecules (patent)",
            "Journal of Materials Chemistry A (patent)",
            "Environmental Science & Technology (patent)",
            "Chemosphere (patent)",
            "The Lancet Infectious Diseases (patent)",
            "JAMA Network Open (patent)",
            "ACS Applied Materials & Interfaces (patent)",
            "Clinical Infectious Diseases (patent)",
            "Nature Energy (patent)",
            "Gastroenterology (patent)",
            "ACS Catalysis (patent)",
            "Advanced Science (patent)",
            "Nature Nanotechnology (patent)",
            "Annals of Oncology (patent)",
            "Gut (patent)",
            "Journal of Environmental Management (patent)",
            "Molecular Cancer (patent)",
            "European Heart Journal (patent)",
            "Physical Review D (patent)",
            "Nature Methods (patent)",
            "Environmental Pollution (patent)",
            "The Astrophysical Journal (patent)",
            "IEEE Transactions on Industrial Informatics (patent)",
            "ACS Energy Letters (patent)",
            "Immunity (patent)",
            "International Journal of Information Management (patent)",
            "Cells (patent)",
            "Expert Systems with Applications (patent)",
            "Water Research (patent)",
            "Applied Sciences (patent)",
            "Energy (patent)",
            "Small (patent)",
            "Environmental Science and Pollution Research (patent)",
            "Renewable Energy (patent)",
            "Bioresource Technology (patent)",
            "Nature Reviews Immunology (patent)",
            "Energy Storage Materials (patent)",
            "Coordination Chemistry Reviews (patent)",
              "Nature (conference)",
              "IEEE/CVF Conference on Computer Vision and Pattern Recognition (conference)",
              "The New England Journal of Medicine (conference)",
              "Science (conference)",
              "Nature Communications (conference)",
              "The Lancet (conference)",
              "Neural Information Processing Systems (conference)",
              "Advanced Materials (conference)",
              "Cell (conference)",
              "International Conference on Learning Representations (conference)",
              "JAMA (conference)",
              "Science of The Total Environment (conference)",
              "IEEE/CVF International Conference on Computer Vision (conference)",
              "Angewandte Chemie International Edition (conference)",
              "Nature Medicine (conference)",
              "Journal of Cleaner Production (conference)",
              "International Conference on Machine Learning (conference)",
              "Chemical Reviews (conference)",
              "Proceedings of the National Academy of Sciences (conference)",
              "IEEE Access (conference)",
              "Chemical Society Reviews (conference)",
              "International Journal of Molecular Sciences (conference)",
              "Advanced Functional Materials (conference)",
              "Advanced Energy Materials (conference)",
              "Journal of the American Chemical Society (conference)",
              "Nucleic Acids Research (conference)",
              "Chemical Engineering Journal (conference)",
              "International Journal of Environmental Research and Public Health (conference)",
              "PLOS ONE (conference)",
              "BMJ (conference)",
              "Science Advances (conference)",
              "Sustainability (conference)",
              "ACS Nano (conference)",
              "Scientific Reports (conference)",
              "AAAI Conference on Artificial Intelligence (conference)",
              "Meeting of the Association for Computational Linguistics (ACL) (conference)",
              "Frontiers in Immunology (conference)",
              "Journal of Clinical Oncology (conference)",
              "Energy & Environmental Science (conference)",
              "Physical Review Letters (conference)",
              "Applied Catalysis B: Environmental (conference)",
              "Circulation (conference)",
              "Journal of Business Research (conference)",
              "Nutrients (conference)",
              "Renewable and Sustainable Energy Reviews (conference)",
              "European Conference on Computer Vision (conference)",
              "The Lancet Oncology (conference)",
              "Journal of Hazardous Materials (conference)",
              "IEEE Transactions on Pattern Analysis and Machine Intelligence (conference)",
              "Morbidity and Mortality Weekly Report (conference)",
              "Conference on Empirical Methods in Natural Language Processing (EMNLP) (conference)",
              "Nature Biotechnology (conference)",
              "Journal of the American College of Cardiology (conference)",
              "Sensors (conference)",
              "Nature Materials (conference)",
              "Applied Energy (conference)",
              "Nano Energy (conference)",
              "Nature Genetics (conference)",
              "Joule (conference)",
              "Technological Forecasting and Social Change (conference)",
              "IEEE Internet of Things Journal (conference)",
              "Frontiers in Psychology (conference)",
              "Molecules (conference)",
              "Journal of Materials Chemistry A (conference)",
              "Environmental Science & Technology (conference)",
              "Chemosphere (conference)",
              "The Lancet Infectious Diseases (conference)",
              "JAMA Network Open (conference)",
              "ACS Applied Materials & Interfaces (conference)",
              "Clinical Infectious Diseases (conference)",
              "Nature Energy (conference)",
              "Gastroenterology (conference)",
              "ACS Catalysis (conference)",
              "Advanced Science (conference)",
              "Nature Nanotechnology (conference)",
              "Annals of Oncology (conference)",
              "Gut (conference)",
              "Journal of Environmental Management (conference)",
              "Molecular Cancer (conference)",
              "European Heart Journal (conference)",
              "Physical Review D (conference)",
              "Nature Methods (conference)",
              "Environmental Pollution (conference)",
              "The Astrophysical Journal (conference)",
              "IEEE Transactions on Industrial Informatics (conference)",
              "ACS Energy Letters (conference)",
              "Immunity (conference)",
              "International Journal of Information Management (conference)",
              "Cells (conference)",
              "Expert Systems with Applications (conference)",
              "Water Research (conference)",
              "Applied Sciences (conference)",
              "Energy (conference)",
              "Small (conference)",
              "Environmental Science and Pollution Research (conference)",
              "Renewable Energy (conference)",
              "Bioresource Technology (conference)",
              "Nature Reviews Immunology (conference)",
              "Energy Storage Materials (conference)",
              "Coordination Chemistry Reviews (conference)",
                "Nature (chapter)",
                "IEEE/CVF Conference on Computer Vision and Pattern Recognition (chapter)",
                "The New England Journal of Medicine (chapter)",
                "Science (chapter)",
                "Nature Communications (chapter)",
                "The Lancet (chapter)",
                "Neural Information Processing Systems (chapter)",
                "Advanced Materials (chapter)",
                "Cell (chapter)",
                "International Conference on Learning Representations (chapter)",
                "JAMA (chapter)",
                "Science of The Total Environment (chapter)",
                "IEEE/CVF International Conference on Computer Vision (chapter)",
                "Angewandte Chemie International Edition (chapter)",
                "Nature Medicine (chapter)",
                "Journal of Cleaner Production (chapter)",
                "International Conference on Machine Learning (chapter)",
                "Chemical Reviews (chapter)",
                "Proceedings of the National Academy of Sciences (chapter)",
                "IEEE Access (chapter)",
                "Chemical Society Reviews (chapter)",
                "International Journal of Molecular Sciences (chapter)",
                "Advanced Functional Materials (chapter)",
                "Advanced Energy Materials (chapter)",
                "Journal of the American Chemical Society (chapter)",
                "Nucleic Acids Research (chapter)",
                "Chemical Engineering Journal (chapter)",
                "International Journal of Environmental Research and Public Health (chapter)",
                "PLOS ONE (chapter)",
                "BMJ (chapter)",
                "Science Advances (chapter)",
                "Sustainability (chapter)",
                "ACS Nano (chapter)",
                "Scientific Reports (chapter)",
                "AAAI Conference on Artificial Intelligence (chapter)",
                "Meeting of the Association for Computational Linguistics (ACL) (chapter)",
                "Frontiers in Immunology (chapter)",
                "Journal of Clinical Oncology (chapter)",
                "Energy & Environmental Science (chapter)",
                "Physical Review Letters (chapter)",
                "Applied Catalysis B: Environmental (chapter)",
                "Circulation (chapter)",
                "Journal of Business Research (chapter)",
                "Nutrients (chapter)",
                "Renewable and Sustainable Energy Reviews (chapter)",
                "European Conference on Computer Vision (chapter)",
                "The Lancet Oncology (chapter)",
                "Journal of Hazardous Materials (chapter)",
                "IEEE Transactions on Pattern Analysis and Machine Intelligence (chapter)",
                "Morbidity and Mortality Weekly Report (chapter)",
                "Conference on Empirical Methods in Natural Language Processing (EMNLP) (chapter)",
                "Nature Biotechnology (chapter)",
                "Journal of the American College of Cardiology (chapter)",
                "Sensors (chapter)",
                "Nature Materials (chapter)",
                "Applied Energy (chapter)",
                "Nano Energy (chapter)",
                "Nature Genetics (chapter)",
                "Joule (chapter)",
                "Technological Forecasting and Social Change (chapter)",
                "IEEE Internet of Things Journal (chapter)",
                "Frontiers in Psychology (chapter)",
                "Molecules (chapter)",
                "Journal of Materials Chemistry A (chapter)",
                "Environmental Science & Technology (chapter)",
                "Chemosphere (chapter)",
                "The Lancet Infectious Diseases (chapter)",
                "JAMA Network Open (chapter)",
                "ACS Applied Materials & Interfaces (chapter)",
                "Clinical Infectious Diseases (chapter)",
                "Nature Energy (chapter)",
                "Gastroenterology (chapter)",
                "ACS Catalysis (chapter)",
                "Advanced Science (chapter)",
                "Nature Nanotechnology (chapter)",
                "Annals of Oncology (chapter)",
                "Gut (chapter)",
                "Journal of Environmental Management (chapter)",
                "Molecular Cancer (chapter)",
                "European Heart Journal (chapter)",
                "Physical Review D (chapter)",
                "Nature Methods (chapter)",
                "Environmental Pollution (chapter)",
                "The Astrophysical Journal (chapter)",
                "IEEE Transactions on Industrial Informatics (chapter)",
                "ACS Energy Letters (chapter)",
                "Immunity (chapter)",
                "International Journal of Information Management (chapter)",
                "Cells (chapter)",
                "Expert Systems with Applications (chapter)",
                "Water Research (chapter)",
                "Applied Sciences (chapter)",
                "Energy (chapter)",
                "Small (chapter)",
                "Environmental Science and Pollution Research (chapter)",
                "Renewable Energy (chapter)",
                "Bioresource Technology (chapter)",
                "Nature Reviews Immunology (chapter)",
                "Energy Storage Materials (chapter)",
                "Coordination Chemistry Reviews (chapter)",
        "National Patent",
        "Regional Patent",
        "Major Projects",
        "Minor Projects",
        "Mtech Students Guided",
        "PhD Students Guided",
        "Organizer National Event",
        "Organizer International Event",
        "Organizer State Event",
        "Organizer College Event",
        "Speaker National Event",
        "Speaker International Event",
        "Speaker State Event",
        "Speaker College Event",
        "Judge National Event",
        "Judge International Event",
        "Judge State Event",
        "Judge College Event",
        "Coordinator National Event",
        "Coordinator International Event",
        "Coordinator State Event",
        "Coordinator College Event",
        "Volunteer National Event",
        "Volunteer International Event",
        "Volunteer State Event",
        "Volunteer College Event",
        "Evaluator National Event",
        "Evaluator International Event",
        "Evaluator State Event",
        "Evaluator College Event",
        "Panelist National Event",
        "Panelist International Event",
        "Panelist State Event",
        "Panelist College Event",
        "Mentor National Event",
        "Mentor International Event",
        "Mentor State Event",
        "Mentor College Event",
        "Session Chair National Event",
        "Session Chair International Event",
        "Session Chair State Event",
        "Session Chair College Event",
        "Reviewer National Event",
        "Reviewer International Event",
        "Reviewer State Event",
        "Reviewer College Event",
        "International Expert Lecture",
        "National Expert Lecture",
        "State Expert Lecture",
        "International Seminar Attended",
        "National Seminar Attended",
        "State Seminar Attended",
        "1-Theory",
        "2-Theory",
        "3-Theory",
        "4-Theory",
        "1-Practical",
        "2-Practical",
        "3-Practical",
        "4-Practical",
        "STTP_1_DAY",
        "STTP_2_3_DAYS",
        "STTP_4_5_DAYS",
        "STTP_1_WEEK",
        "STTP_2_WEEKS",
        "STTP_3_WEEKS",
        "STTP_4_WEEKS",
        "Seminar",
        "Ongoing Funded Above ₹10 Lakh Research",
        "Ongoing Funded Below ₹10 Lakh Research",
        "Completed Funded Above ₹10 Lakh Research",
        "Completed Funded Below ₹10 Lakh Research",
        "Industrial-Visit-Other",
        "Wookshop-Conducted-Other",
        "Extra-Course-Studied-Other",
        "Made-Study-Materials-Other",
        "Miscellaneous",
        "Task-Points-Other",
      ],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
  },
  { timestamps: true }
);

export const Point = mongoose.model("Point", pointSchema);
