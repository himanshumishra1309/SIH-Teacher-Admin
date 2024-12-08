import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler2.js";
import { ApiError } from "../utils/ApiErrors.js";
import { DomainPoint } from "../models/domainpoints.models.js";

const addPoints = asyncHandler(async (req, res) => {
  const { domain, points } = req.body;

  if (!domain || !points) {
    return new ApiError(400, "Domain and points are required.");
  }

  const existingDomain = await DomainPoint.findOne({ domain });
  if (existingDomain) {
    return new ApiError(400, "Domain already exists.");
  }

  const newDomainPoint = await DomainPoint.create({ domain, points });

  res
    .status(201)
    .json(
      new ApiResponse(201, newDomainPoint, "Domain points added successfully.")
    );
});

// Update points for an existing domain
const updatePoints = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { points } = req.body;
  const domainId = id;

  // Validate the presence of `domainId` and `points`
  if (!domainId) {
    throw new ApiError(400, "Domain ID is required.");
  }
  if (points === undefined) {
    throw new ApiError(400, "Points are required.");
  }

  // Update the domain points
  const updatedConfig = await DomainPoint.findByIdAndUpdate(
    domainId, // Use the domainId to find the record
    { points }, // Update only the points field
    { new: true } // Return the updated document
  );

  if (!updatedConfig) {
    throw new ApiError(404, "Domain not found.");
  }

  // Respond with the updated configuration
  res
    .status(200)
    .json(
      new ApiResponse(200, updatedConfig, "Domain points updated successfully.")
    );
});

// Delete a domain and its points
const deletePoints = asyncHandler(async (req, res) => {
  const { domain } = req.params;

  if (!domain) {
    return new ApiError(400, "Domain is required.");
  }

  const deletedConfig = await DomainPoint.findOneAndDelete({ domain });

  if (!deletedConfig) {
    return new ApiError(404, "Domain not found.");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, deletedConfig, "Domain points deleted successfully.")
    );
});

// Get all domains and their points
const getAllPoints = asyncHandler(async (req, res) => {
  const DomainPoints = await DomainPoint.find();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        DomainPoints,
        "All domain points fetched successfully."
      )
    );
});

// Get journal domain points
const getJournalPoints = asyncHandler(async (req, res) => {
  const journalDomains = [
    "International Journal",
    "National Journal",
    "Regional Journal",
  ];
  const journalPoints = await DomainPoint.find({
    domain: { $in: journalDomains },
  });

  if (!journalPoints || journalPoints.length === 0) {
    throw new ApiError(404, "No journal points found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        journalPoints,
        "Journal points retrieved successfully"
      )
    );
});

// Edit journal domain points
const editJournalPoints = asyncHandler(async (req, res) => {
  const { points } = req.body;

  // const { journalPoints } = req.body;
  const journalPoints = points;

  if (!journalPoints || !Array.isArray(journalPoints)) {
    throw new ApiError(400, "Invalid journal points data");
  }

  const updatedJournalPoints = await Promise.all(
    journalPoints.map(async ({ domain, points }) => {
      const updatedPoint = await DomainPoint.findOneAndUpdate(
        { domain },
        { points },
        { new: true, runValidators: true }
      );
      if (!updatedPoint) {
        throw new ApiError(404, `Domain not found: ${domain}`);
      }
      return updatedPoint;
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedJournalPoints,
        "Journal points updated successfully"
      )
    );
});

// Get book domain points
const getBookPoints = asyncHandler(async (req, res) => {
  const bookDomains = ["International Book", "National Book", "Regional Book"];
  const bookPoints = await DomainPoint.find({ domain: { $in: bookDomains } });

  if (!bookPoints || bookPoints.length === 0) {
    throw new ApiError(404, "No book points found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, bookPoints, "Book points retrieved successfully")
    );
});

// Edit book domain points
const editBookPoints = asyncHandler(async (req, res) => {
  const { points } = req.body;
  console.log(points);

  if (!points || !Array.isArray(points)) {
    throw new ApiError(400, "Invalid book points data");
  }

  const updatedBookPoints = await Promise.all(
    points.map(async ({ domain, points }) => {
      const updatedPoint = await DomainPoint.findOneAndUpdate(
        { domain },
        { points },
        { new: true, runValidators: true }
      );
      if (!updatedPoint) {
        throw new ApiError(404, `Domain not found: ${domain}`);
      }
      return updatedPoint;
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedBookPoints,
        "Book points updated successfully"
      )
    );
});

// Get chapter domain points
const getChapterPoints = asyncHandler(async (req, res) => {
  const chapterDomains = [
    "International Chapter",
    "National Chapter",
    "Regional Chapter",
  ];
  const chapterPoints = await DomainPoint.find({
    domain: { $in: chapterDomains },
  });

  if (!chapterPoints || chapterPoints.length === 0) {
    throw new ApiError(404, "No chapter points found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        chapterPoints,
        "Chapter points retrieved successfully"
      )
    );
});

// Edit chapter domain points
const editChapterPoints = asyncHandler(async (req, res) => {
  
  const { points } = req.body;
  const chapterPoints = points;

  if (!chapterPoints || !Array.isArray(chapterPoints)) {
    throw new ApiError(400, "Invalid chapter points data");
  }

  const updatedChapterPoints = await Promise.all(
    chapterPoints.map(async ({ domain, points }) => {
      const updatedPoint = await DomainPoint.findOneAndUpdate(
        { domain },
        { points },
        { new: true, runValidators: true }
      );
      if (!updatedPoint) {
        throw new ApiError(404, `Domain not found: ${domain}`);
      }
      return updatedPoint;
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedChapterPoints,
        "Chapter points updated successfully"
      )
    );
});

// Get conference domain points
const getConferencePoints = asyncHandler(async (req, res) => {
  const conferenceDomains = [
    "International Conference",
    "National Conference",
    "Regional Conference",
  ];
  const conferencePoints = await DomainPoint.find({
    domain: { $in: conferenceDomains },
  });

  if (!conferencePoints || conferencePoints.length === 0) {
    throw new ApiError(404, "No conference points found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        conferencePoints,
        "Conference points retrieved successfully"
      )
    );
});

// Edit conference domain points
const editConferencePoints = asyncHandler(async (req, res) => {
  const { points } = req.body;

  const conferencePoints = points

  if (!conferencePoints || !Array.isArray(conferencePoints)) {
    throw new ApiError(400, "Invalid conference points data");
  }

  const updatedConferencePoints = await Promise.all(
    conferencePoints.map(async ({ domain, points }) => {
      const updatedPoint = await DomainPoint.findOneAndUpdate(
        { domain },
        { points },
        { new: true, runValidators: true }
      );
      if (!updatedPoint) {
        throw new ApiError(404, `Domain not found: ${domain}`);
      }
      return updatedPoint;
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedConferencePoints,
        "Conference points updated successfully"
      )
    );
});

// Get patent domain points
const getPatentPoints = asyncHandler(async (req, res) => {
  const patentDomains = [
    "International Patent",
    "National Patent",
    "Regional Patent",
  ];
  const patentPoints = await DomainPoint.find({
    domain: { $in: patentDomains },
  });

  if (!patentPoints || patentPoints.length === 0) {
    throw new ApiError(404, "No patent points found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, patentPoints, "Patent points retrieved successfully")
    );
});

// Edit patent domain points
const editPatentPoints = asyncHandler(async (req, res) => {
  const { points } = req.body;

  const patentPoints = points

  if (!patentPoints || !Array.isArray(patentPoints)) {
    throw new ApiError(400, "Invalid patent points data");
  }

  const updatedPatentPoints = await Promise.all(
    patentPoints.map(async ({ domain, points }) => {
      const updatedPoint = await DomainPoint.findOneAndUpdate(
        { domain },
        { points },
        { new: true, runValidators: true }
      );
      if (!updatedPoint) {
        throw new ApiError(404, `Domain not found: ${domain}`);
      }
      return updatedPoint;
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPatentPoints,
        "Patent points updated successfully"
      )
    );
});

// Get project domain points
const getProjectPoints = asyncHandler(async (req, res) => {
  const projectDomains = ["Major Projects", "Minor Projects"];
  const projectPoints = await DomainPoint.find({
    domain: { $in: projectDomains },
  });

  if (!projectPoints || projectPoints.length === 0) {
    throw new ApiError(404, "No project points found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        projectPoints,
        "Project points retrieved successfully"
      )
    );
});

// Edit project domain points
const editProjectPoints = asyncHandler(async (req, res) => {
  const { projectPoints } = req.body;

  if (!projectPoints || !Array.isArray(projectPoints)) {
    throw new ApiError(400, "Invalid project points data");
  }

  const updatedProjectPoints = await Promise.all(
    projectPoints.map(async ({ domain, points }) => {
      const updatedPoint = await DomainPoint.findOneAndUpdate(
        { domain },
        { points },
        { new: true, runValidators: true }
      );
      if (!updatedPoint) {
        throw new ApiError(404, `Domain not found: ${domain}`);
      }
      return updatedPoint;
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedProjectPoints,
        "Project points updated successfully"
      )
    );
});

// Get student guidance domain points
const getStudentGuidancePoints = asyncHandler(async (req, res) => {
  const guidanceDomains = ["Mtech Students Guided", "PhD Students Guided"];
  const guidancePoints = await DomainPoint.find({
    domain: { $in: guidanceDomains },
  });

  if (!guidancePoints || guidancePoints.length === 0) {
    throw new ApiError(404, "No student guidance points found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        guidancePoints,
        "Student guidance points retrieved successfully"
      )
    );
});

// Edit student guidance domain points
const editStudentGuidancePoints = asyncHandler(async (req, res) => {
  const { guidancePoints } = req.body;

  if (!guidancePoints || !Array.isArray(guidancePoints)) {
    throw new ApiError(400, "Invalid student guidance points data");
  }

  const updatedGuidancePoints = await Promise.all(
    guidancePoints.map(async ({ domain, points }) => {
      const updatedPoint = await DomainPoint.findOneAndUpdate(
        { domain },
        { points },
        { new: true, runValidators: true }
      );
      if (!updatedPoint) {
        throw new ApiError(404, `Domain not found: ${domain}`);
      }
      return updatedPoint;
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedGuidancePoints,
        "Student guidance points updated successfully"
      )
    );
});

// Get event organizer domain points
const getEventOrganizerPoints = asyncHandler(async (req, res) => {
  const organizerDomains = [
    "Organizer National Event",
    "Organizer International Event",
    "Organizer State Event",
    "Organizer College Event",
  ];
  const organizerPoints = await DomainPoint.find({
    domain: { $in: organizerDomains },
  });

  if (!organizerPoints || organizerPoints.length === 0) {
    throw new ApiError(404, "No event organizer points found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        organizerPoints,
        "Event organizer points retrieved successfully"
      )
    );
});

// Edit event organizer domain points
const editEventOrganizerPoints = asyncHandler(async (req, res) => {
  const { organizerPoints } = req.body;

  if (!organizerPoints || !Array.isArray(organizerPoints)) {
    throw new ApiError(400, "Invalid event organizer points data");
  }

  const updatedOrganizerPoints = await Promise.all(
    organizerPoints.map(async ({ domain, points }) => {
      const updatedPoint = await DomainPoint.findOneAndUpdate(
        { domain },
        { points },
        { new: true, runValidators: true }
      );
      if (!updatedPoint) {
        throw new ApiError(404, `Domain not found: ${domain}`);
      }
      return updatedPoint;
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedOrganizerPoints,
        "Event organizer points updated successfully"
      )
    );
});

// Get event speaker domain points
const getEventSpeakerPoints = asyncHandler(async (req, res) => {
  const speakerDomains = [
    "Speaker National Event",
    "Speaker International Event",
    "Speaker State Event",
    "Speaker College Event",
  ];
  const speakerPoints = await DomainPoint.find({
    domain: { $in: speakerDomains },
  });

  if (!speakerPoints || speakerPoints.length === 0) {
    throw new ApiError(404, "No event speaker points found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        speakerPoints,
        "Event speaker points retrieved successfully"
      )
    );
});

// Edit event speaker domain points
const editEventSpeakerPoints = asyncHandler(async (req, res) => {
  const { speakerPoints } = req.body;

  if (!speakerPoints || !Array.isArray(speakerPoints)) {
    throw new ApiError(400, "Invalid event speaker points data");
  }

  const updatedSpeakerPoints = await Promise.all(
    speakerPoints.map(async ({ domain, points }) => {
      const updatedPoint = await DomainPoint.findOneAndUpdate(
        { domain },
        { points },
        { new: true, runValidators: true }
      );
      if (!updatedPoint) {
        throw new ApiError(404, `Domain not found: ${domain}`);
      }
      return updatedPoint;
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedSpeakerPoints,
        "Event speaker points updated successfully"
      )
    );
});

// Get event judge domain points
const getEventJudgePoints = asyncHandler(async (req, res) => {
  const judgeDomains = [
    "Judge National Event",
    "Judge International Event",
    "Judge State Event",
    "Judge College Event",
  ];
  const judgePoints = await DomainPoint.find({ domain: { $in: judgeDomains } });

  if (!judgePoints || judgePoints.length === 0) {
    throw new ApiError(404, "No event judge points found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        judgePoints,
        "Event judge points retrieved successfully"
      )
    );
});

// Edit event judge domain points
const editEventJudgePoints = asyncHandler(async (req, res) => {
  const { judgePoints } = req.body;

  if (!judgePoints || !Array.isArray(judgePoints)) {
    throw new ApiError(400, "Invalid event judge points data");
  }

  const updatedJudgePoints = await Promise.all(
    judgePoints.map(async ({ domain, points }) => {
      const updatedPoint = await DomainPoint.findOneAndUpdate(
        { domain },
        { points },
        { new: true, runValidators: true }
      );
      if (!updatedPoint) {
        throw new ApiError(404, `Domain not found: ${domain}`);
      }
      return updatedPoint;
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedJudgePoints,
        "Event judge points updated successfully"
      )
    );
});

// Get event coordinator domain points
const getEventCoordinatorPoints = asyncHandler(async (req, res) => {
  const coordinatorDomains = [
    "Coordinator National Event",
    "Coordinator International Event",
    "Coordinator State Event",
    "Coordinator College Event",
  ];
  const coordinatorPoints = await DomainPoint.find({
    domain: { $in: coordinatorDomains },
  });

  if (!coordinatorPoints || coordinatorPoints.length === 0) {
    throw new ApiError(404, "No event coordinator points found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        coordinatorPoints,
        "Event coordinator points retrieved successfully"
      )
    );
});

// Edit event coordinator domain points
const editEventCoordinatorPoints = asyncHandler(async (req, res) => {
  const { coordinatorPoints } = req.body;

  if (!coordinatorPoints || !Array.isArray(coordinatorPoints)) {
    throw new ApiError(400, "Invalid event coordinator points data");
  }

  const updatedCoordinatorPoints = await Promise.all(
    coordinatorPoints.map(async ({ domain, points }) => {
      const updatedPoint = await DomainPoint.findOneAndUpdate(
        { domain },
        { points },
        { new: true, runValidators: true }
      );
      if (!updatedPoint) {
        throw new ApiError(404, `Domain not found: ${domain}`);
      }
      return updatedPoint;
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedCoordinatorPoints,
        "Event coordinator points updated successfully"
      )
    );
});

// Get event volunteer domain points
const getEventVolunteerPoints = asyncHandler(async (req, res) => {
  const volunteerDomains = [
    "Volunteer National Event",
    "Volunteer International Event",
    "Volunteer State Event",
    "Volunteer College Event",
  ];
  const volunteerPoints = await DomainPoint.find({
    domain: { $in: volunteerDomains },
  });

  if (!volunteerPoints || volunteerPoints.length === 0) {
    throw new ApiError(404, "No event volunteer points found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        volunteerPoints,
        "Event volunteer points retrieved successfully"
      )
    );
});

// Edit event volunteer domain points
const editEventVolunteerPoints = asyncHandler(async (req, res) => {
  const { volunteerPoints } = req.body;

  if (!volunteerPoints || !Array.isArray(volunteerPoints)) {
    throw new ApiError(400, "Invalid event volunteer points data");
  }

  const updatedVolunteerPoints = await Promise.all(
    volunteerPoints.map(async ({ domain, points }) => {
      const updatedPoint = await DomainPoint.findOneAndUpdate(
        { domain },
        { points },
        { new: true, runValidators: true }
      );
      if (!updatedPoint) {
        throw new ApiError(404, `Domain not found: ${domain}`);
      }
      return updatedPoint;
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedVolunteerPoints,
        "Event volunteer points updated successfully"
      )
    );
});

// Get event evaluator domain points
const getEventEvaluatorPoints = asyncHandler(async (req, res) => {
  const evaluatorDomains = [
    "Evaluator National Event",
    "Evaluator International Event",
    "Evaluator State Event",
    "Evaluator College Event",
  ];
  const evaluatorPoints = await DomainPoint.find({
    domain: { $in: evaluatorDomains },
  });

  if (!evaluatorPoints || evaluatorPoints.length === 0) {
    throw new ApiError(404, "No event evaluator points found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        evaluatorPoints,
        "Event evaluator points retrieved successfully"
      )
    );
});

// Edit event evaluator domain points
const editEventEvaluatorPoints = asyncHandler(async (req, res) => {
  const { evaluatorPoints } = req.body;

  if (!evaluatorPoints || !Array.isArray(evaluatorPoints)) {
    throw new ApiError(400, "Invalid event evaluator points data");
  }

  const updatedEvaluatorPoints = await Promise.all(
    evaluatorPoints.map(async ({ domain, points }) => {
      const updatedPoint = await DomainPoint.findOneAndUpdate(
        { domain },
        { points },
        { new: true, runValidators: true }
      );
      if (!updatedPoint) {
        throw new ApiError(404, `Domain not found: ${domain}`);
      }
      return updatedPoint;
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedEvaluatorPoints,
        "Event evaluator points updated successfully"
      )
    );
});

// Get event panelist domain points
const getEventPanelistPoints = asyncHandler(async (req, res) => {
  const panelistDomains = [
    "Panelist National Event",
    "Panelist International Event",
    "Panelist State Event",
    "Panelist College Event",
  ];
  const panelistPoints = await DomainPoint.find({
    domain: { $in: panelistDomains },
  });

  if (!panelistPoints || panelistPoints.length === 0) {
    throw new ApiError(404, "No event panelist points found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        panelistPoints,
        "Event panelist points retrieved successfully"
      )
    );
});

// Edit event panelist domain points
const editEventPanelistPoints = asyncHandler(async (req, res) => {
  const { panelistPoints } = req.body;

  if (!panelistPoints || !Array.isArray(panelistPoints)) {
    throw new ApiError(400, "Invalid event panelist points data");
  }

  const updatedPanelistPoints = await Promise.all(
    panelistPoints.map(async ({ domain, points }) => {
      const updatedPoint = await DomainPoint.findOneAndUpdate(
        { domain },
        { points },
        { new: true, runValidators: true }
      );
      if (!updatedPoint) {
        throw new ApiError(404, `Domain not found: ${domain}`);
      }
      return updatedPoint;
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPanelistPoints,
        "Event panelist points updated successfully"
      )
    );
});

// Get event mentor domain points
const getEventMentorPoints = asyncHandler(async (req, res) => {
  const mentorDomains = [
    "Mentor National Event",
    "Mentor International Event",
    "Mentor State Event",
    "Mentor College Event",
  ];
  const mentorPoints = await DomainPoint.find({
    domain: { $in: mentorDomains },
  });

  if (!mentorPoints || mentorPoints.length === 0) {
    throw new ApiError(404, "No event mentor points found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        mentorPoints,
        "Event mentor points retrieved successfully"
      )
    );
});

// Edit event mentor domain points
const editEventMentorPoints = asyncHandler(async (req, res) => {
  const { mentorPoints } = req.body;

  if (!mentorPoints || !Array.isArray(mentorPoints)) {
    throw new ApiError(400, "Invalid event mentor points data");
  }

  const updatedMentorPoints = await Promise.all(
    mentorPoints.map(async ({ domain, points }) => {
      const updatedPoint = await DomainPoint.findOneAndUpdate(
        { domain },
        { points },
        { new: true, runValidators: true }
      );
      if (!updatedPoint) {
        throw new ApiError(404, `Domain not found: ${domain}`);
      }
      return updatedPoint;
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedMentorPoints,
        "Event mentor points updated successfully"
      )
    );
});

// Get event session chair domain points
const getEventSessionChairPoints = asyncHandler(async (req, res) => {
  const sessionChairDomains = [
    "Session Chair National Event",
    "Session Chair International Event",
    "Session Chair State Event",
    "Session Chair College Event",
  ];
  const sessionChairPoints = await DomainPoint.find({
    domain: { $in: sessionChairDomains },
  });

  if (!sessionChairPoints || sessionChairPoints.length === 0) {
    throw new ApiError(404, "No event session chair points found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        sessionChairPoints,
        "Event session chair points retrieved successfully"
      )
    );
});

// Edit event session chair domain points
const editEventSessionChairPoints = asyncHandler(async (req, res) => {
  const { sessionChairPoints } = req.body;

  if (!sessionChairPoints || !Array.isArray(sessionChairPoints)) {
    throw new ApiError(400, "Invalid event session chair points data");
  }

  const updatedSessionChairPoints = await Promise.all(
    sessionChairPoints.map(async ({ domain, points }) => {
      const updatedPoint = await DomainPoint.findOneAndUpdate(
        { domain },
        { points },
        { new: true, runValidators: true }
      );
      if (!updatedPoint) {
        throw new ApiError(404, `Domain not found: ${domain}`);
      }
      return updatedPoint;
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedSessionChairPoints,
        "Event session chair points updated successfully"
      )
    );
});

// Get event reviewer domain points
const getEventReviewerPoints = asyncHandler(async (req, res) => {
  const reviewerDomains = [
    "Reviewer National Event",
    "Reviewer International Event",
    "Reviewer State Event",
    "Reviewer College Event",
  ];
  const reviewerPoints = await DomainPoint.find({
    domain: { $in: reviewerDomains },
  });

  if (!reviewerPoints || reviewerPoints.length === 0) {
    throw new ApiError(404, "No event reviewer points found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        reviewerPoints,
        "Event reviewer points retrieved successfully"
      )
    );
});

// Edit event reviewer domain points
const editEventReviewerPoints = asyncHandler(async (req, res) => {
  const { reviewerPoints } = req.body;

  if (!reviewerPoints || !Array.isArray(reviewerPoints)) {
    throw new ApiError(400, "Invalid event reviewer points data");
  }

  const updatedReviewerPoints = await Promise.all(
    reviewerPoints.map(async ({ domain, points }) => {
      const updatedPoint = await DomainPoint.findOneAndUpdate(
        { domain },
        { points },
        { new: true, runValidators: true }
      );
      if (!updatedPoint) {
        throw new ApiError(404, `Domain not found: ${domain}`);
      }
      return updatedPoint;
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedReviewerPoints,
        "Event reviewer points updated successfully"
      )
    );
});

// Get expert lecture domain points
const getExpertLecturePoints = asyncHandler(async (req, res) => {
  const lectureDomains = [
    "International Expert Lecture",
    "National Expert Lecture",
    "State Expert Lecture",
  ];
  const lecturePoints = await DomainPoint.find({
    domain: { $in: lectureDomains },
  });

  if (!lecturePoints || lecturePoints.length === 0) {
    throw new ApiError(404, "No expert lecture points found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        lecturePoints,
        "Expert lecture points retrieved successfully"
      )
    );
});

// Edit expert lecture domain points
const editExpertLecturePoints = asyncHandler(async (req, res) => {
  const { lecturePoints } = req.body;

  if (!lecturePoints || !Array.isArray(lecturePoints)) {
    throw new ApiError(400, "Invalid expert lecture points data");
  }

  const updatedLecturePoints = await Promise.all(
    lecturePoints.map(async ({ domain, points }) => {
      const updatedPoint = await DomainPoint.findOneAndUpdate(
        { domain },
        { points },
        { new: true, runValidators: true }
      );
      if (!updatedPoint) {
        throw new ApiError(404, `Domain not found: ${domain}`);
      }
      return updatedPoint;
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedLecturePoints,
        "Expert lecture points updated successfully"
      )
    );
});

// Get seminar attended domain points
const getSeminarAttendedPoints = asyncHandler(async (req, res) => {
  const seminarDomains = [
    "International Seminar Attended",
    "National Seminar Attended",
    "State Seminar Attended",
  ];
  const seminarPoints = await DomainPoint.find({
    domain: { $in: seminarDomains },
  });

  if (!seminarPoints || seminarPoints.length === 0) {
    throw new ApiError(404, "No seminar attended points found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        seminarPoints,
        "Seminar attended points retrieved successfully"
      )
    );
});

// Edit seminar attended domain points
const editSeminarAttendedPoints = asyncHandler(async (req, res) => {
  const { seminarPoints } = req.body;

  if (!seminarPoints || !Array.isArray(seminarPoints)) {
    throw new ApiError(400, "Invalid seminar attended points data");
  }

  const updatedSeminarPoints = await Promise.all(
    seminarPoints.map(async ({ domain, points }) => {
      const updatedPoint = await DomainPoint.findOneAndUpdate(
        { domain },
        { points },
        { new: true, runValidators: true }
      );
      if (!updatedPoint) {
        throw new ApiError(404, `Domain not found: ${domain}`);
      }
      return updatedPoint;
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedSeminarPoints,
        "Seminar attended points updated successfully"
      )
    );
});

// Get theory course domain points
const getTheoryCoursePoints = asyncHandler(async (req, res) => {
  const theoryDomains = ["1-Theory", "2-Theory", "3-Theory", "4-Theory"];
  const theoryPoints = await DomainPoint.find({
    domain: { $in: theoryDomains },
  });

  if (!theoryPoints || theoryPoints.length === 0) {
    throw new ApiError(404, "No theory course points found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        theoryPoints,
        "Theory course points retrieved successfully"
      )
    );
});

// Edit theory course domain points
const editTheoryCoursePoints = asyncHandler(async (req, res) => {
  const { theoryPoints } = req.body;

  if (!theoryPoints || !Array.isArray(theoryPoints)) {
    throw new ApiError(400, "Invalid theory course points data");
  }

  const updatedTheoryPoints = await Promise.all(
    theoryPoints.map(async ({ domain, points }) => {
      const updatedPoint = await DomainPoint.findOneAndUpdate(
        { domain },
        { points },
        { new: true, runValidators: true }
      );
      if (!updatedPoint) {
        throw new ApiError(404, `Domain not found: ${domain}`);
      }
      return updatedPoint;
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedTheoryPoints,
        "Theory course points updated successfully"
      )
    );
});

// Get practical course domain points
const getPracticalCoursePoints = asyncHandler(async (req, res) => {
  const practicalDomains = [
    "1-Practical",
    "2-Practical",
    "3-Practical",
    "4-Practical",
  ];
  const practicalPoints = await DomainPoint.find({
    domain: { $in: practicalDomains },
  });

  if (!practicalPoints || practicalPoints.length === 0) {
    throw new ApiError(404, "No practical course points found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        practicalPoints,
        "Practical course points retrieved successfully"
      )
    );
});

// Edit practical course domain points
const editPracticalCoursePoints = asyncHandler(async (req, res) => {
  const { practicalPoints } = req.body;

  if (!practicalPoints || !Array.isArray(practicalPoints)) {
    throw new ApiError(400, "Invalid practical course points data");
  }

  const updatedPracticalPoints = await Promise.all(
    practicalPoints.map(async ({ domain, points }) => {
      const updatedPoint = await DomainPoint.findOneAndUpdate(
        { domain },
        { points },
        { new: true, runValidators: true }
      );
      if (!updatedPoint) {
        throw new ApiError(404, `Domain not found: ${domain}`);
      }
      return updatedPoint;
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPracticalPoints,
        "Practical course points updated successfully"
      )
    );
});

// Get STTP domain points
const getSttpPoints = asyncHandler(async (req, res) => {
  const sttpDomains = [
    "STTP_1_DAY",
    "STTP_2_3_DAYS",
    "STTP_4_5_DAYS",
    "STTP_1_WEEK",
    "STTP_2_WEEKS",
    "STTP_3_WEEKS",
    "STTP_4_WEEKS",
  ];
  const sttpPoints = await DomainPoint.find({ domain: { $in: sttpDomains } });

  if (!sttpPoints || sttpPoints.length === 0) {
    throw new ApiError(404, "No STTP points found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, sttpPoints, "STTP points retrieved successfully")
    );
});

// Edit STTP domain points
const editSttpPoints = asyncHandler(async (req, res) => {
  const { sttpPoints } = req.body;

  if (!sttpPoints || !Array.isArray(sttpPoints)) {
    throw new ApiError(400, "Invalid STTP points data");
  }

  const updatedSttpPoints = await Promise.all(
    sttpPoints.map(async ({ domain, points }) => {
      const updatedPoint = await DomainPoint.findOneAndUpdate(
        { domain },
        { points },
        { new: true, runValidators: true }
      );
      if (!updatedPoint) {
        throw new ApiError(404, `Domain not found: ${domain}`);
      }
      return updatedPoint;
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedSttpPoints,
        "STTP points updated successfully"
      )
    );
});

// Get seminar domain points
const getSeminarPoints = asyncHandler(async (req, res) => {
  const seminarPoints = await DomainPoint.findOne({ domain: "Seminar" });

  if (!seminarPoints) {
    throw new ApiError(404, "No seminar points found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        seminarPoints,
        "Seminar points retrieved successfully"
      )
    );
});

// Edit seminar domain points
const editSeminarPoints = asyncHandler(async (req, res) => {
  const { points } = req.body;

  if (points === undefined) {
    throw new ApiError(400, "Invalid seminar points data");
  }

  const updatedSeminarPoints = await DomainPoint.findOneAndUpdate(
    { domain: "Seminar" },
    { points },
    { new: true, runValidators: true }
  );

  if (!updatedSeminarPoints) {
    throw new ApiError(404, "Seminar domain not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedSeminarPoints,
        "Seminar points updated successfully"
      )
    );
});

// Get all event-related domain points
const getAllEventPoints = asyncHandler(async (req, res) => {
  const eventDomains = [
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
  ];

  const eventPoints = await DomainPoint.find({
    domain: { $in: eventDomains },
  }).sort({ domain: 1 });

  if (!eventPoints || eventPoints.length === 0) {
    throw new ApiError(404, "No event-related points found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        eventPoints,
        "All event-related points retrieved successfully"
      )
    );
});

// Edit all event-related domain points
const editAllEventPoints = asyncHandler(async (req, res) => {
  const { points } = req.body;
  const eventRouter = points;

  if (!eventPoints || !Array.isArray(eventPoints)) {
    throw new ApiError(400, "Invalid event points data");
  }

  const updatedEventPoints = await Promise.all(
    eventPoints.map(async ({ domain, points }) => {
      const updatedPoint = await DomainPoint.findOneAndUpdate(
        { domain },
        { points },
        { new: true, runValidators: true }
      );
      if (!updatedPoint) {
        throw new ApiError(404, `Domain not found: ${domain}`);
      }
      return updatedPoint;
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedEventPoints,
        "All event-related points updated successfully"
      )
    );
});

export {
  addPoints,
  updatePoints,
  deletePoints,
  getAllPoints,
  getJournalPoints,
  editJournalPoints,
  getBookPoints,
  editBookPoints,
  getChapterPoints,
  editChapterPoints,
  getConferencePoints,
  editConferencePoints,
  getPatentPoints,
  editPatentPoints,
  getProjectPoints,
  editProjectPoints,
  getStudentGuidancePoints,
  editStudentGuidancePoints,
  getEventOrganizerPoints,
  editEventOrganizerPoints,
  getEventSpeakerPoints,
  editEventSpeakerPoints,
  getEventJudgePoints,
  editEventJudgePoints,
  getEventCoordinatorPoints,
  editEventCoordinatorPoints,
  getEventVolunteerPoints,
  editEventVolunteerPoints,
  getEventEvaluatorPoints,
  editEventEvaluatorPoints,
  getEventPanelistPoints,
  editEventPanelistPoints,
  getEventMentorPoints,
  editEventMentorPoints,
  getEventSessionChairPoints,
  editEventSessionChairPoints,
  getEventReviewerPoints,
  editEventReviewerPoints,
  getExpertLecturePoints,
  editExpertLecturePoints,
  getSeminarAttendedPoints,
  editSeminarAttendedPoints,
  getTheoryCoursePoints,
  editTheoryCoursePoints,
  getPracticalCoursePoints,
  editPracticalCoursePoints,
  getSttpPoints,
  editSttpPoints,
  getSeminarPoints,
  editSeminarPoints,
  getAllEventPoints,
  editAllEventPoints,
};
