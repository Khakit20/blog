// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDKic-qByxSdYDtgvXtTQ52IJ47Tm_kF9Q",
    authDomain: "ntut-77ba7.firebaseapp.com",
    projectId: "ntut-77ba7",
    storageBucket: "ntut-77ba7.appspot.com",
    messagingSenderId: "218985730334",
    appId: "1:218985730334:web:e37779ef18a8a34e62b90f"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        //sign in
        console.log("sign in user", user);
        if (user.email == "admin@gmail.com") {
            setTimeout(function(){},5000);
            $("#loader").fadeOut();
        } else {
            alert("YOU ARE NOT ADMIN");
            window.location.href='https://snwbs.github.io/blog/main.html';
        }
    } else {
        //sign out
        console.log("sign out", user);
        alert("Sign out")
        window.location.href='https://snwbs.github.io/blog/login.html';
    }
})

var $blogTableBody = $("#blogTableBody");

var $signUpForm = $("#signUpForm"),
    $signUpEmail = $("#signUpEmail"),
    $signUpPassword = $("#signUpPassword");

// Sign in form
var $signInForm = $("#signInForm"),
    $signInEmail = $("#signInEmail"),
    $signInPassword = $("#signInPassword");

$("body").delegate(".delete-blog-btn", "click", function () {
    console.log($(this).attr("data-id"));
    const blogId = $(this).attr("data-id");
    db
        .doc(`blogList/${blogId}`)
        .delete()
        .then(() => {
            alert("This blog is removed");
            //window.location.reload();
        })
        .catch(err => console.log(err))
});

$("body").delegate(".delete-commit-btn", "click", function () {
    console.log($(this).attr("data-id"));
    const commitId = $(this).attr("data-id");
    db
        .doc(`commitList/${commitId}`)
        .delete()
        .then(() => {
            alert("This commit is removed");
            window.location.reload();
        })
        .catch(err => console.log(err))
});



const blogList = [];
db.collection("blogList").get()
    .then(docList => {
        docList.forEach(doc => {
            const blog = doc.data();
            const blogId = doc.id;
            blog['id'] = blogId;
            // Add blog(object) to blogList(array)
            blogList.push(blog);
            //console.group("blog", blog);
        });
        renderblogList();
    })
    .catch(err => console.log("err", err));

function renderblogList() {
    blogList.forEach(blog => {
        // Append option to create & update select UI
        $("#createblog, #updateblog").append(
            `<option value="${blog.id}">${blog.Name}</options>`
        );

        // Create HTML table row for each blog
        const tableRow = `<tr>
            <td>${blog.name}</td>
            <td>
                <div class="color-box bg-${blog.color}"></div>
            </td>
            <td>
                <button data-id="${blog.id}"  class="btn btn-warning update-blog-btn">Update xxx</button>
                <button data-id="${blog.id}"  class="btn btn-danger delete-blog-btn">Delete</button>
            </td>
        </tr>`
        $blogTableBody.append(tableRow);
    })
    //bootstrap selectpicker
    $("#createblog, #updateblog").selectpicker();
    //console.log(blogList);
}

// binding click for .update-blog-btn
$("body").delegate(".update-blog-btn", "click", function () {
    // Get blog id from button element
    const blogId = $(this).attr("data-id");
    // Find that object with the same id in blogList
    const blog = blogList.find(t => {
        return t.id == blogId
    })

    console.log("blogId", blogId);
    console.log("blog", blog);
    //Fill blog value in UI
    $("#updateblogId").val(blogId)
    $("#updateblogName").val(blog.Name);
    $("#updateblogPicture").val(blog.picture);
    $("#updateblogRating").val(blog.rating);
    $("#updateblogdetailed").val(blog.detailed);
    $("#updateblogModal").modal();
});

$("#updateblogForm").submit(function (e) {
    // prevent browser to refresh
    e.preventDefault();
    // Get tag ID
    const blogId = $("#updateblogId").val()
    // Create new tag object
    const blog = {
        Name: $("#updateblogName").val(),
        picture: $("#updateblogPicture").val(),
        rating: $("#updateblogRating").val(),
        detailed: $("#updateblogdetailed").val()
    };
    console.log(blogId, blog);
    // Update data
    // .doc("COLLECTION/DOC_ID")
    db.doc(`blogList/${blogId}`)
        .update(blog)
        .then(() => {
            alert("Update!");
            window.location.reload();
        })
        .catch(err => console.log(err));
})

$signUpForm.submit(function (e) {
    e.preventDefault();
    // When sign up form submitted
    console.log("Ready for sign up");
    const email = $signUpEmail.val();
    const password = $signUpPassword.val();
    firebase
        .auth()
        .createUserWithEmailAndPassword(email,password).then(res =>
            {
                console.log("Sign up",res);
                alert("Sign up");
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
            })
});


// Sign out button
var $signOutBtn = $("#signOutBtn");

$signInForm.submit(function (e) {
    e.preventDefault();
    // When sign in form submitted
    console.log("Ready for sign in");
    const email = $signInEmail.val();
    const password = $signInPassword.val();
    console.log(email, password);
    // firebase sign in method
    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(res => {
            console.log("Sign In", res);
            alert("Sign in");
            if (email == "admin@gmail.com") {
                window.location = "https://snwbs.github.io/blog/admin.html";
            }
        })
        .catch(err => {
            console.log(err);
            if (err.code == 'auth/wrong-password') {
                alert("wrong password");
            } else if (err.code == 'auth/user-not-found') {
                alert("User not found!");
            }
        });
});

$signOutBtn.click(function () {
    // When click sign out button
    console.log("Ready for sign out");
    firebase.auth().signOut()
        .then(() => {
            window.location = "https://snwbs.github.io/blog/index.html"
        })
        .catch(err => console.log(err))
});


const $createReviewForm = $("#createReviewForm");
const $createReviewTitle = $("#createReviewTitle");
const $createReviewRating = $("#createReviewRating");
const $createReviewDetailed = $("#createReviewDetailed");
const $Title = $("Title");
const $createPostImage = $("#createPostImage");
const $createPostImageURL = $("#createPostImageURL");
const $imagePreview = $("#imagePreview");
const $createPostBtn = $("#createPostBtn");
const $tbody = $("#tbody");


$createReviewRating.raty({ 
    score: 1 
});


$createPostImage.change(function (e) {
    // Get the file object when user choose any files
    const file = this.files[0];
    const fileName = file.name;
    // Setup folder path for firebase storage
    const storagePath = `previewImages/${fileName}`;
    const ref = firebase.storage().ref(storagePath);
    // Upload file to firebase storage
    console.log(`Start Upload image to: ${storagePath}`);
    $createPostImageURL.text(`Start Upload image to: ${storagePath}`);
    ref.put(file)
        .then(snapshot => {
            // If file is uploaded successfully
            console.log(snapshot);
            // Get image URL
            ref.getDownloadURL()
                .then(imageURL => {
                    console.log("imageURL", imageURL);
                    $createPostImageURL.text(`${imageURL}`);
                    const picture = (`<img src="${imageURL}">`);
                    $imagePreview.append(picture);
                })
                .catch(err => {
                    $createPostImageURL.text(`Error: ${err}`);
                    console.log(err)
                });
        })
        .catch(err => {
            $createPostImageURL.text(`Error: ${err}`);
            console.log(err)
        });
});

$createReviewForm.submit(function (e) {
    e.preventDefault();
    console.log("New picture Form Submitted !");
    const post = {
        Name: $createReviewTitle.val(),
        detailed: $createReviewDetailed.text(),
        picture: $createPostImageURL.text(),
        rating: $createReviewRating.data('raty').score()
    };
    db.collection("blogList/").add(post)
        .then(() => {
            window.location.reload();
        })
        .catch(err => console.log(err));
});

db
    .collection("blogList")
    .get()
    .then(blogList => {
        var i =0;
        blogList.forEach(doc => {
            const blog = doc.data();
            console.log("[blog]", blog);
            const col = `
                <tr>
                        <th>${blog.Name}</th>
                        <th><div id = "${i}" class = "hi"></div></th>
                </tr>
                <tr>
                        <th><img src="${blog.picture}" width="600" height="450"></th>
                        <th>
                            <button data-id="${doc.id}"  class="btn btn-warning update-blog-btn">Update</button>
                            <button data-id="${doc.id}"  class="btn btn-danger delete-blog-btn">Delete</button>
                        </th>

                </tr>
    `;
            $("#tbody").append(col);
            $("#"+i).raty({
                score : blog.rating,
                click: function(score, evt) {
                    const updateReview = {
                        title : blog.Name,
                        rating : score,
                    };
                    db.doc(`blogList/${doc.id}`)
                        .update(updateReview)
                        .then(() => {
                            alert("Update!");
                            window.location.reload();
                        })
                        .catch(err => console.log(err));
                }
            });
            i += 1;
        })
    })
    .catch(err => {
        console.log("[err]", err);
    });

db
    .collection("commitList")
    .get()
    .then(commitList => {
        commitList.forEach(doc => {
            const commit = doc.data();
            console.log("[commit]", commit);
            const col = `
                <tr>
                        <th width="80%">${commit.commit}</th>
                        <th width="20%"><button data-id="${doc.id}"  class="btn btn-danger delete-commit-btn">Delete</button></th>
                </tr>
    `;
            $("#committable").append(col);
        })
    })
    .catch(err => {
        console.log("[err]", err);
    });


const ratyOptions = {
    starHalf: "https://cdnjs.cloudflare.com/ajax/libs/raty/3.1.1/images/star-half.png",
    starOff: "https://cdnjs.cloudflare.com/ajax/libs/raty/3.1.1/images/star-off.png",
    starOn: "https://cdnjs.cloudflare.com/ajax/libs/raty/3.1.1/images/star-on.png"
}
