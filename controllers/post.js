const cloudinary = require("cloudinary");
const slugify = require("slugify");
const Category = require("../models/category");
const Media = require("../models/media");
const Post = require("../models/post");
const User = require("../models/user");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadImage = async (req, res) => {
  try {
    // console.log(req.body);
    const result = await cloudinary.uploader.upload(req.body.image);
    // console.log(result);
    res.json(result.secure_url);
  } catch (err) {
    console.log(err);
  }
};

const createPost = async (req, res) => {
  // console.log(req.body)
  try {
    // console.log(req.body);
    const { title, content, categories } = req.body;
    // check if title is taken
    const alreadyExist = await Post.findOne({
      slug: slugify(title.toLowerCase()),
    });
    if (alreadyExist) return res.json({ error: "Title is taken" });

    // get category ids based on category name
    let ids = [];
    for (let i = 0; i < categories.length; i++) {
      Category.findOne({
        name: categories[i],
      }).exec((err, data) => {
        if (err) return console.log(err);
        ids.push(data._id);
      });
    }

    // save post
    setTimeout(async () => {
      try {
        const newPost = await new Post({
          ...req.body,
          slug: slugify(title),
          categories: ids,
          postedBy: req.user._id,
        }).save();

        // push post id to user's posts array
        await User.findByIdAndUpdate(req.user._id, {
          $addToSet: { posts: newPost._id },
        });
        return res.json(newPost);
      } catch (err) {
        console.log(err);
      }
    }, 1000);
  } catch (err) {
    console.log(err);
  }
};

const posts = async (req, res) => {
  try {
    const all = await Post.find()
      .populate("featuredImage")
      .populate("postedBy", "name")
      .populate("categories", "name slug")
      .sort({ createdAt: -1 });
    res.json(all);
  } catch (err) {
    console.log(err);
  }
};

const uploadImageFile = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.files.file.path);
    // save to db
    const media = await new Media({
      url: result.secure_url,
      public_id: result.public_id,
      postedBy: req.user._id,
    }).save();
    res.json(media);
  } catch (err) {
    console.log(err);
  }
};

const media = async (req, res) => {
  try {
    console.log("am hitting this");
    const media = await Media.find()
      .populate("postedBy", "_id")
      .sort({ createdAt: -1 });

    console.log("after getting data from db");

    res.json(media);
  } catch (err) {
    console.log(err);
  }
};

const removeMedia = async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

const singlePost = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ slug })
      .populate("postedBy", "name")
      .populate("categories", "name slug")
      .populate("featuredImage", "url");
    res.json(post);
  } catch (err) {
    console.log(err);
  }
};

const removePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.postId);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

const editPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content, featuredImage, categories } = req.body;
    // get category ids based on category name
    let ids = [];
    for (let i = 0; i < categories.length; i++) {
      Category.findOne({
        name: categories[i],
      }).exec((err, data) => {
        if (err) return console.log(err);
        ids.push(data._id);
      });
    }

    setTimeout(async () => {
      const post = await Post.findByIdAndUpdate(
        postId,
        {
          title,
          slug: slugify(title),
          content,
          categories: ids,
          featuredImage,
        },
        { new: true }
      )
        .populate("postedBy", "name")
        .populate("categories", "name slug")
        .populate("featuredImage", "url");

      res.json(post);
    }, 1000);
  } catch (err) {
    console.log(err);
  }
};

const postsByAuthor = async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.user._id })
      .populate("postedBy", "name")
      .populate("categories", "name slug")
      .populate("featuredImage", "url")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.log(err);
  }
};

const postCount = async (req, res) => {
  try {
    const count = await Post.countDocuments();
    res.json(count);
  } catch (err) {
    console.log(err);
  }
};

const postsPage = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page || 1;

    const all = await Post.find()
      .skip((page - 1) * perPage)
      .populate("featuredImage")
      .populate("postedBy", "name")
      .populate("categories", "name slug")
      .sort({ createdAt: -1 })
      .limit(perPage);

    res.json(all);
  } catch (err) {
    console.log(err);
  }
};

const getNumbers = async (req, res) => {
  try {
    const posts = await Post.countDocuments();
    const users = await User.countDocuments();

    const categories = await Category.countDocuments();

    return res.json({ posts, users, categories });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  uploadImage,
  createPost,
  posts,
  uploadImageFile,
  removeMedia,
  media,
  singlePost,
  removePost,
  editPost,
  postsByAuthor,
  postCount,
  postsPage,
  getNumbers
};
