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
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (attachments.length === 0) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {attachments.map((file, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 h-[300px]">
              {file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Attachment ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              ) : file.type.startsWith("video/") ? (
                <video
                  src={URL.createObjectURL(file)}
                  controls
                  className="w-full h-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="bg-muted p-4 text-center h-full flex items-center justify-center">
                  <div>
                    <p>{file.name}</p>
                    <p>File type not supported for preview</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {attachments.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2"
            onClick={scrollPrev}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={scrollNext}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    contributionType: "",
    attachments: [],
  });
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
        title: post.title,
        description: post.description,
        contributionType: post.contributionType,
        attachments: post.images[0], // Map images to attachments
      }));

      // Update state with the formatted posts
      // setPosts(formattedPosts);
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
      newPost.attachments.forEach((file) => formData.append("images", file));

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
      setNewPost({
        title: "",
        description: "",
        contributionType: "",
        attachments: [],
      });
      setIsCreatePostOpen(false);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleAttachment = (e) => {
    const files = Array.from(e.target.files);
    setNewPost({ ...newPost, attachments: [...newPost.attachments, ...files] });
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
              <Input
                placeholder="Title"
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
              />
              <Input
                placeholder="Contribution Type"
                value={newPost.contributionType}
                onChange={(e) =>
                  setNewPost({ ...newPost, contributionType: e.target.value })
                }
              />
              <Textarea
                placeholder="Share your achievement..."
                value={newPost.description}
                onChange={(e) =>
                  setNewPost({ ...newPost, description: e.target.value })
                }
              />
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
              <Button type="submit">
                <SendIcon className="mr-2 h-4 w-4" />
                Post
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedPosts.map((post) => (
            <Card
              key={post.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3">{post.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                  <span className="text-sm text-muted-foreground">
                    {post.createdAt.toLocaleDateString()}
                  </span>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">View Post</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-center">
                        {post.title}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {/* <div className="flex items-center space-x-4"> */}
                      {/* <Avatar>
                          <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                          <AvatarFallback>UN</AvatarFallback>
                        </Avatar> */}
                      {/* <div>
                          <p className="text-sm font-medium">User Name</p>
                          <p className="text-sm text-muted-foreground">
                            {post.createdAt.toLocaleString()}
                          </p>
                        </div>
                      </div> */}
                      <p>{post.content}</p>
                      <AttachmentCarousel attachments={post.attachments} />
                    </div>
                  </DialogContent>
                </Dialog>
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
