// const Sauce = require('../models/Sauce')

// exports.getSauces = async (req, res) => {
//   //call to database
//   //format array
//   //res.send(array)
//   //console.log(res)

//   Sauce.find()
//     .then(res => {
//       console.log(res)
//     })

//   res.send('array of sauces')
// };

// // fetch('/route')
// // .then(res => res.json())
// // .then(data => {
// //   console.log(data)
// // })

// exports.getId = async (req, res) => {
//   res.send('giving id')
// }
// exports.postSauces = async (req, res) => {
//   res.send('post successful')
// }
// exports.updateId = async (req, res) => {
//     res.send('update successful')
// }
// exports.deleteId = async (req, res) => {
//     res.send('delete successful')
// }
const Sauce = require('../models/Sauce');

exports.getSauces = async (req, res) => {
  const sauces = await Sauce.find();
  res.json(sauces);
};

exports.getId = async (req, res) => {
  try {

    const id = req.params.id;
    console.log(id)
    const sauce = await Sauce.findById(id);

    if (sauce) {
      res.json(sauce);
    } else {
      res.sendStatus(404);
    }
  } catch {
    console.log('error')
  }


};

exports.postSauces = async (req, res) => {
  const sauce = await req.body;
  console.log(sauc)
  const newSauce = new Sauce({
    ...sauce,
  });

  await newSauce.save();

  res.sendStatus(201);
};

exports.updateId = async (req, res) => {
  const id = req.params.id;
  const sauce = await req.body;
  const updatedSauce = await Sauce.findByIdAndUpdate(id, sauce, {
    new: true,
  });

  if (updatedSauce) {
    res.json(updatedSauce);
  } else {
    res.sendStatus(404);
  }
};

exports.deleteId = async (req, res) => {
  const id = req.params.id;
  const deletedSauce = await Sauce.findByIdAndDelete(id);

  if (deletedSauce) {
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};
// exports.postLike = async (req, res) => {
//   const like = req.body.like;
//   try {
//     const sauce = await Sauce.findById(req.params.id);
//     console.log(sauce)
//     if (like === 1 || like === "1") {
//       sauce.usersLiked.push(req.body.userId)
//       sauce.likes++
//       await sauce.save()
//     } else if (like === 0) {
//       let index = sauce.usersLiked.indexOf(req.body.userId)

//       if (index !== -1) {
//         sauce.usersLiked.splice(index, 1)
//       }
//       await sauce.save()
//     } else {
//       sauce.usersDisliked.push(req.body.userId)
//       sauce.likes--
//       await sauce.save()
//     }
//   } catch (error) {
//     res.status(500).send(error);
//   }
// }
exports.postLike = async (req, res) => {
  console.log(req.params.id)
  const like = parseInt(req.body.like);

  //if 1, check usersLiked array, if user already liked then do nothing
  //if 0, check both usersLiked and usersDisliked and find where the userId is stored. Remove the value.
  //if -1, check usersDisliked for userId. If it exists, do nothing. If it doesn't, store their userID and add -1 to liked.

  //if clicking usersDisliked, you need to remove from usersLiked array if the userId exists in there. Do the same for usersLiked.

  //if you click usersDisliked, make sure you're not just adding -1. If a user already liked and the value is at 1, then adding -1 would only ->
  //-> put it back to 0.



  //before making a put request, check if the request's userID matches the sauce userID. If it doesn't match, reject the put request.



  try {
    const sauce = await Sauce.findById(req.params.id);
    console.log(sauce)
    if (like === 1) {
      let index = sauce.usersLiked.indexOf(req.body.userId)
      let dislikedIndex = sauce.usersDisliked.indexOf(req.body.userId)
      // console.log(index, req.body.userId)

      if (index === -1 && dislikedIndex !== -1) {
        sauce.usersLiked.push(req.body.userId)
        sauce.usersDisliked.splice(dislikedIndex, 1)
        sauce.likes += 2
      } else if (index === -1) {
        sauce.usersLiked.push(req.body.userId)
        sauce.likes += 1
      }


      if (sauce.isModified("likes")) {
        await sauce.save()
      }

    } else if (like === 0) {
      let likedIndex = sauce.usersLiked.indexOf(req.body.userId)
      let dislikedIndex = sauce.usersDisliked.indexOf(req.body.userId)

      if (likedIndex !== -1) {
        sauce.usersLiked.splice(likedIndex, 1)
        sauce.likes--
      }

      if (dislikedIndex !== -1) {
        sauce.usersDisliked.splice(dislikedIndex, 1)
        sauce.likes++
      }

      await sauce.save()
    } else {

      let likedIndex = sauce.usersLiked.indexOf(req.body.userId)
      let dislikedIndex = sauce.usersDisliked.indexOf(req.body.userId)
      console.log(likedIndex, req.body.userId)

      if (dislikedIndex === -1 && likedIndex !== -1) {
        sauce.usersDisliked.push(req.body.userId)
        sauce.usersLiked.splice(likedIndex, 1)
        sauce.likes -= 2
      } else if (dislikedIndex === -1) {
        sauce.usersDisliked.push(req.body.userId)
        sauce.likes--
      }

      await sauce.save()

    }
    res.status(200).send("Operation completed successfully.");
  } catch (error) {
    res.status(500).send(error);
  }
}
