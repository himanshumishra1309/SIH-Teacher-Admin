import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarIcon,
  PaperclipIcon,
  SendIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import axios from "axios";

const POSTS_PER_PAGE = 6;

const AttachmentCarousel = ({ attachments }) => {
  if (!attachments || !Array.isArray(attachments)) {
    console.error("Invalid attachments array", attachments);
    return (
      <div className="p-4 bg-muted">
        <p>No attachments available</p>
      </div>
    );
  }

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {attachments.map((attachment, index) => {
            const url =
              typeof attachment === "string" ? attachment : attachment?.url;
            return url ? (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0 h-[300px] flex items-center justify-center bg-black"
              >
                <img
                  src={url}
                  alt={`Attachment ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div
                key={index}
                className="flex-[0_0_100%] h-[300px] flex items-center justify-center bg-muted"
              >
                <p>Invalid attachment</p>
              </div>
            );
          })}
        </div>
      </div>
      {attachments.length > 1 && (
        <>
          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2"
            onClick={scrollPrev}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2"
            onClick={scrollNext}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  );
};

// Rest of your code with fixes applied for error handling, pagination, and missing keys.

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    contributionType: "",
    description: "",
    attachments: [],
    report: null,
  });

  // console.log(posts);

  const [currentPage, setCurrentPage] = useState(1);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const getPosts = async () => {
    try {
      const teacherAccessToken = sessionStorage.getItem("teacherAccessToken");
      const response = await axios.get(
        "http://localhost:6005/api/v1/posts/post/get",
        {
          headers: {
            Authorization: `Bearer ${teacherAccessToken}`,
          },
        }
      );
      console.log(response.data.data.contributions);
      const formattedPosts = response.data.data.contributions.map((post) => ({
        id: post._id, // Use a unique identifier (e.g., `_id`) or fallback to generated ID
        title: post.title,
        description: post.description,
        contributionType: post.contributionType,
        attachments: Array.isArray(post.images) ? post.images : [], // Ensure `images` is an array
        createdAt: new Date(post.createdAt), // Ensure proper date conversion
        report: post.report,
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    getPosts(); // Fetch posts on component mount
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      console.log(newPost);
      const formData = new FormData();
      formData.append("title", newPost.title);
      formData.append("description", newPost.description);
      formData.append("contributionType", newPost.contributionType);
      newPost.attachments.forEach((file) => {
        formData.append("images", file);
      });

      if (newPost.report) {
        formData.append("report", newPost.report);
      }
      const teacherAccessToken = sessionStorage.getItem("teacherAccessToken");

      // Make the POST request with the teacher access token in the Authorization header
      const response = await axios.post(
        "http://localhost:6005/api/v1/posts/post/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${teacherAccessToken}`,
          },
        }
      );
      console.log(response);

      setPosts([
        { id: Date.now(), ...newPost, createdAt: new Date() },
        ...posts,
      ]);
      if (response.status === 200) {
        alert("Contribution created successfully!");
        // Reset form state
        setNewPost({
          title: "",
          contributionType: "",
          description: "",
          attachments: [],
          report: null,
        });
      }
      setIsCreatePostOpen(false);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // Function to handle the post update
  const handleEditPost = async (e, p) => {
    e.preventDefault();
    console.log(p)

    try {
      console.log(newPost);
      
      const formData = new FormData();
      formData.append("title", newPost.title);
      formData.append("description", newPost.description);
      formData.append("contributionType", newPost.contributionType);

      newPost.attachments.forEach((file) => {
        formData.append("images", file);
      });

      if (newPost.report) {
        formData.append("report", newPost.report);
      }

      const teacherAccessToken = sessionStorage.getItem("teacherAccessToken");

      // Send the request to the server to update the post
      const response = await axios.patch(
        `http://localhost:6005/api/v1/posts/post/update/${p.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${teacherAccessToken}`,
          },
        }
      );

      console.log(response);

      if (response.status === 200) {
        // Update the local state with the edited post details
        setPosts((prevPosts) =>
          prevPosts.map((existingPost) =>
            existingPost.id === post.id
              ? { ...existingPost, ...newPost, updatedAt: new Date() }
              : existingPost
          )
        );
        alert("Post updated successfully!");

        // Reset the form and close the modal/dialog
        setNewPost({
          title: "",
          contributionType: "",
          description: "",
          attachments: [],
          report: null,
        });
        setIsCreatePostOpen(false); // Assuming you're using the same dialog for editing
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update the post.");
    }
  };
  const handleAttachment = (e) => {
    const files = Array.from(e.target.files);
    setNewPost({ ...newPost, attachments: [...newPost.attachments, ...files] });
  };

  const handleReportFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPost({ ...newPost, report: file });
    }
  };

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const paginatedPosts = posts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Faculty Achievements</h1>
        <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
          <DialogTrigger asChild>
            <Button className="text-white">
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create a New Post</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePost} className="space-y-4">
              {/* Title Input */}
              <Input
                placeholder="Title"
                a
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
              />

              {/* Contribution Type Input */}
              <Input
                placeholder="Contribution Type"
                value={newPost.contributionType}
                onChange={(e) =>
                  setNewPost({ ...newPost, contributionType: e.target.value })
                }
              />

              {/* Description Input */}
              <Textarea
                placeholder="Share your achievement..."
                value={newPost.description}
                onChange={(e) =>
                  setNewPost({ ...newPost, description: e.target.value })
                }
              />

              {/* Attachments Input */}
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  multiple
                  onChange={handleAttachment}
                  className="hidden"
                  id="file-upload"
                  accept="image/*,video/*"
                />
                <Button type="button" variant="outline" asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <PaperclipIcon className="mr-2 h-4 w-4" />
                    Attach Files
                  </label>
                </Button>
                <span>{newPost.attachments.length} file(s) selected</span>
              </div>

              {/* Report File Input */}
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  onChange={handleReportFile}
                  className="hidden"
                  id="report-upload"
                  accept=".pdf,.doc,.docx"
                />
                <Button type="button" variant="outline" asChild>
                  <label htmlFor="report-upload" className="cursor-pointer">
                    <PaperclipIcon className="mr-2 h-4 w-4" />
                    Upload Report
                  </label>
                </Button>
                <span>
                  {newPost.report ? newPost.report.name : "No report selected"}
                </span>
              </div>

              {/* Submit Button */}
              <Button type="submit">
                <SendIcon className="mr-2 h-4 w-4" />
                Post
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)] bg-gray-50 p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedPosts.map((post) => (
            <Card
              key={post.id}
              className="cursor-pointer hover:shadow-xl border border-gray-200 rounded-lg transition-transform transform hover:scale-105 bg-white"
            >
              {/* Card Header */}
              <CardHeader className="border-b border-gray-200 p-4 bg-gray-100 rounded-t-lg">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {post.title}
                </CardTitle>
              </CardHeader>

              {/* Card Content */}
              <CardContent className="p-4">
                <p className="text-gray-700 line-clamp-3">{post.description}</p>
              </CardContent>

              {/* Card Footer */}
              <CardFooter className="flex flex-col space-y-2 p-4 border-t border-gray-200">
                {/* Post Date */}
                <div className="flex items-center text-gray-600 text-sm">
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-80" />
                  <span>{post.createdAt.toLocaleDateString()}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center space-x-2">
                  {/* View Report Button */}
                  {post.report && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-500 border-blue-500 hover:bg-blue-50"
                      onClick={() => {
                        window.open(post.report, "_blank");
                      }}
                    >
                      View Report
                    </Button>
                  )}

                  {/* View Post Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-600 border-gray-400 hover:bg-gray-100"
                      >
                        View Post
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto rounded-lg shadow-lg">
                      <DialogHeader>
                        <DialogTitle className="text-center font-bold text-lg">
                          {post.title}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 p-4">
                        {/* Post Description */}
                        <p className="text-gray-600">{post.description}</p>

                        {/* Carousel for Attachments */}
                        <AttachmentCarousel attachments={post.attachments} />
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Edit Post Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-600 border-gray-400 hover:bg-gray-100"
                      >
                        Edit Post
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto rounded-lg shadow-lg">
                      <DialogHeader>
                        <DialogTitle className="text-center font-bold text-lg">
                          Edit Post: {post.title}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 p-4">
                        {/* Edit Form (To be implemented) */}
                        <p>Edit form content goes here...</p>
                        <form onSubmit={(e) => (handleEditPost(e, post))} className="space-y-4">
                          {/* Title Input */}
                          <Input
                            placeholder="Title"
                            a
                            value={newPost.title}
                            onChange={(e) =>
                              setNewPost({ ...newPost, title: e.target.value })
                            }
                          />

                          {/* Contribution Type Input */}
                          <Input
                            placeholder="Contribution Type"
                            value={newPost.contributionType}
                            onChange={(e) =>
                              setNewPost({
                                ...newPost,
                                contributionType: e.target.value,
                              })
                            }
                          />

                          {/* Description Input */}
                          <Textarea
                            placeholder="Share your achievement..."
                            value={newPost.description}
                            onChange={(e) =>
                              setNewPost({
                                ...newPost,
                                description: e.target.value,
                              })
                            }
                          />

                          {/* Attachments Input */}
                          <div className="flex items-center space-x-2">
                            <Input
                              type="file"
                              multiple
                              onChange={handleAttachment}
                              className="hidden"
                              id="file-upload"
                              accept="image/*,video/*"
                            />
                            <Button type="button" variant="outline" asChild>
                              <label
                                htmlFor="file-upload"
                                className="cursor-pointer"
                              >
                                <PaperclipIcon className="mr-2 h-4 w-4" />
                                Attach Files
                              </label>
                            </Button>
                            <span>
                              {newPost.attachments.length} file(s) selected
                            </span>
                          </div>

                          {/* Report File Input */}
                          <div className="flex items-center space-x-2">
                            <Input
                              type="file"
                              onChange={handleReportFile}
                              className="hidden"
                              id="report-upload"
                              accept=".pdf,.doc,.docx"
                            />
                            <Button type="button" variant="outline" asChild>
                              <label
                                htmlFor="report-upload"
                                className="cursor-pointer"
                              >
                                <PaperclipIcon className="mr-2 h-4 w-4" />
                                Upload Report
                              </label>
                            </Button>
                            <span>
                              {newPost.report
                                ? newPost.report.name
                                : "No report selected"}
                            </span>
                          </div>

                          {/* Submit Button */}
                          <Button type="submit">
                            <SendIcon className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </form>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostsPage;
