import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler2.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Patent2 } from "../models/patent.models.2.js";
import { PublicationPoint } from "../models/publication-points.models.js";

const addPatent = asyncHandler(async (req, res) => {
  const {
    title,
    // inventors,
    patentOffice,
    publicationDate,
    publication,
    patentNumber,
    applicationNumber,
  } = req.body;
  const owner = req.teacher._id;

  if (
    !title ||
    // !inventors ||
    !publicationDate ||
    !patentOffice ||
    !patentNumber ||
    !applicationNumber
  ) {
    throw new ApiError(400, "Please provide all mandatory fields");
  }

  const publications = await PublicationPoint.findById(publication);

  const h5_index = publications.hindex;
  const h5_median = publications.median;

  const patentEntry = await Patent2.create({
    title,
    inventors: "John Doe",
    publicationDate,
    patentOffice,
    publication,
    patentNumber,
    applicationNumber,
    h5_index,
    h5_median,
    owner,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, patentEntry, "Patent added successfully"));
});

const updatePatent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    inventors,
    publicationDate,
    patentOffice,
    patentNumber,
    applicationNumber,
  } = req.body;

  const updatedPatent = await Patent2.findByIdAndUpdate(
    id,
    {
      $set: {
        title,
        inventors,
        publicationDate,
        patentOffice,
        patentNumber,
        applicationNumber,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedPatent) {
    throw new ApiError(404, "Patent not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPatent, "Patent updated successfully"));
});

const deletePatent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedPatent = await Patent2.findByIdAndDelete(id);

  if (!deletedPatent) {
    throw new ApiError(404, "Patent not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Patent deleted successfully"));
});

const getAllPatents = asyncHandler(async (req, res) => {
  // const owner = req.teacher._id;
  const {id} = req.params;
  const owner = id;
  const patents = await Patent2.find({ owner }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, patents, "All patents retrieved successfully"));
});

export { addPatent, updatePatent, deletePatent, getAllPatents };
