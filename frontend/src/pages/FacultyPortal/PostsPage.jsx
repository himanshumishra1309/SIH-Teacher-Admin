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

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    contributionType: "",
    description: "",
    attachments: [],
    report: null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getPosts = async () => {
    setIsLoading(true); // Start loading
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
    } finally {
      setIsLoading(false);
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

      setPosts([newPost, ...posts]);
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

  const handleEditPost = async (e, p) => {
    e.preventDefault();
    console.log(p);

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
      setIsCreatePostOpen(false);

      if (response.status === 200) {
        // Update the local state with the edited post details
        setPosts((prevPosts) =>
          prevPosts.map((existingPost) =>
            existingPost.id === p.id
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
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Create New Contribution</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePost}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <Input
                    type="text"
                    value={newPost.title}
                    onChange={(e) =>
                      setNewPost({ ...newPost, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contribution Type
                  </label>
                  <Input
                    type="text"
                    value={newPost.contributionType}
                    onChange={(e) =>
                      setNewPost({
                        ...newPost,
                        contributionType: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <Textarea
                    rows={4}
                    value={newPost.description}
                    onChange={(e) =>
                      setNewPost({ ...newPost, description: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Attachments (Images & Files)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      multiple
                      onChange={handleAttachment}
                      className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:text-sm file:bg-gray-50 file:text-gray-700 file:hover:border-gray-600"
                    />
                    <PaperclipIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div>
                  {/* <label className="block text-sm font-medium text-gray-700">
                    Report (Optional)
                  </label> */}
                  {/* <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      onChange={handleReportFile}
                      className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:text-sm file:bg-gray-50 file:text-gray-700 file:hover:border-gray-600"
                    />
                    <PaperclipIcon className="h-5 w-5 text-gray-400" />
                  </div> */}
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button type="submit" className="text-white">
                  <SendIcon className="mr-2 h-4 w-4" />
                  Submit
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="h-[70vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <p>Loading posts...</p>
          ) : (
            paginatedPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{post.description}</p>
                  {post.attachments.length > 0 && (
                    <AttachmentCarousel attachments={post.attachments} />
                  )}
                </CardContent>
                <CardFooter>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 inline" />
                      {post.createdAt.toLocaleDateString()}
                    </p>
                    {/* <Button
                      variant="outline"
                      onClick={() => handleEditPost(post.id)}
                    >
                      Edit
                    </Button> */}
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
      <div className="mt-6 flex justify-center">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="mr-2"
        >
          Previous
        </Button>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default PostsPage;
