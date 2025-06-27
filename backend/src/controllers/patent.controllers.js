import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler2.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Patent } from "../models/patent.models.js";

const addPatent = asyncHandler(async (req, res) => {
  const {
    title,
    inventors,
    patentOffice,
    publicationDate,
    patentType,
    patentNumber,
    applicationNumber,
  } = req.body;
  const owner = req.teacher._id;

  if (
    !title ||
    !inventors ||
    !patentType ||
    !publicationDate ||
    !patentOffice ||
    !patentNumber ||
    !applicationNumber
  ) {
    throw new ApiError(400, "Please provide all mandatory fields");
  }
  const patentEntry = await Patent.create({
    title,
    inventors,
    publicationDate,
    patentOffice,
    patentType,
    patentNumber,
    applicationNumber,
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

  const updatedPatent = await Patent.findByIdAndUpdate(
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

  const deletedPatent = await Patent.findByIdAndDelete(id);

  if (!deletedPatent) {
    throw new ApiError(404, "Patent not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Patent deleted successfully"));
});

const getAllPatents = asyncHandler(async (req, res) => {
  const { id } = useParams();
  const owner = id;
  const patents = await Patent.find({ owner }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, patents, "All patents retrieved successfully"));
});

export { addPatent, updatePatent, deletePatent, getAllPatents };
