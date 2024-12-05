import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler2.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ResearchPaper } from "../models/research-papers.models.js";

const uploadPaper = asyncHandler(async (req, res) => {
  const { name, publication, publishedDate, viewUrl } = req.body;
  console.log(name, "name");
  console.log(publication, "publication");
  console.log(publishedDate, "publishedDate");
  console.log(viewUrl, "viewURL");

  if (
    [name, publication, publishedDate, viewUrl].some(
      (field) => !field || typeof field !== "string" || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const paper = await ResearchPaper.findOne({ viewUrl });

  if (paper) {
    throw new ApiError(400, "This paper already exists");
  }

  const researchPaper = await ResearchPaper.create({
    name,
    addedOn: Date.now(),
    publication,
    publishedDate,
    viewUrl,
    owner: req.teacher._id,
  });

  if (!researchPaper) {
    throw new ApiError(
      500,
      "Something went wrong while adding the research paper"
    );
  }

  console.log("researchPaper", researchPaper);

  return res
    .status(200)
    .json(
      new ApiResponse(
        201,
        researchPaper,
        "New research paper successfully added"
      )
    );
});

const showAllResearchPaper = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [total, researchPapers] = await Promise.all([
    ResearchPaper.countDocuments({ owner: req.teacher._id }),
    ResearchPaper.find({ owner: req.teacher._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        total,
        page,
        pages: Math.ceil(total / limit),
        researchPapers,
      },
      "Research Papers Retrived Successfully"
    )
  );
});

const updatePaper = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, publication, publishedDate, viewUrl } = req.body;

  // Find the research paper by id
  const researchPaper = await ResearchPaper.findById(id);

  if (!researchPaper) {
    throw new ApiError(404, "No research paper found");
  }

  // Check if the authenticated user is the owner of the paper
  if (researchPaper.owner.toString() !== req.teacher._id.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to update this research paper"
    );
  }

  // Update fields only if provided and valid
  if (name) researchPaper.name = name;
  if (publication) researchPaper.publication = publication;
  if (publishedDate) researchPaper.publishedDate = publishedDate;
  if (viewUrl) {
    // Check if the new viewUrl already exists in another paper
    const existingPaper = await ResearchPaper.findOne({
      viewUrl,
      _id: { $ne: id },
    });
    if (existingPaper) {
      throw new ApiError(
        400,
        "Another research paper with this viewUrl already exists"
      );
    }
    researchPaper.viewUrl = viewUrl;
  }

  // Save updated paper
  const updatedPaper = await researchPaper.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedPaper, "Research paper updated successfully")
    );
});

//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const skip = (page - 1) * limit;

//   const [total, researchPapers] = await Promise.all([
//     ResearchPaper.countDocuments({ owner: req.user._id }),
//     ResearchPaper.find({ owner: req.user._id })
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit),
//   ]);

//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       {
//         total,
//         page,
//         pages: Math.ceil(total / limit),
//         researchPapers,
//       },
//       "Research Papers Retrived Successfully"
//     )
//   );
// });

// const updatePaper = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { name, publication, publishedDate, viewUrl } = req.body;

//   // Find the research paper by id
//   const researchPaper = await ResearchPaper.findById(id);

//   if (!researchPaper) {
//     throw new ApiError(404, "No research paper found");
//   }

//   // Check if the authenticated user is the owner of the paper
//   if (researchPaper.owner.toString() !== req.user._id.toString()) {
//     throw new ApiError(
//       403,
//       "You are not authorized to update this research paper"
//     );
//   }

//   // Update fields only if provided and valid
//   if (name) researchPaper.name = name;
//   if (publication) researchPaper.publication = publication;
//   if (publishedDate) researchPaper.publishedDate = publishedDate;
//   if (viewUrl) {
//     // Check if the new viewUrl already exists in another paper
//     const existingPaper = await ResearchPaper.findOne({
//       viewUrl,
//       _id: { $ne: id },
//     });
//     if (existingPaper) {
//       throw new ApiError(
//         400,
//         "Another research paper with this viewUrl already exists"
//       );
//     }
//     researchPaper.viewUrl = viewUrl;
//   }

//   // Save updated paper
//   const updatedPaper = await researchPaper.save();

//   return res
//     .status(200)
//     .json(
//       new ApiResponse(200, updatedPaper, "Research paper updated successfully")
//     );
// });

const deletePaper = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const researchPaper = await ResearchPaper.findByIdAndDelete(id);

  if (!researchPaper) {
    throw new ApiError(404, "Research Paper Not Found or Unauthorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Research paper deleted successfully"));
});

export { uploadPaper, showAllResearchPaper, updatePaper, deletePaper };
