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


var Today=new Date();


firebase.auth().onAuthStateChanged(user => {
    if (user) {
        setTimeout(function(){},5000);
        $("#loader").fadeOut();
    } else {
        alert("You are not user");
        window.location = "https://snwbs.github.io/blog/";
    }
})

// Sign out button
var $signOutBtn = $("#signOutBtn");

$signOutBtn.click(function () {
    // When click sign out button
    console.log("Ready for sign out");
    firebase.auth().signOut()
        .then(() => {
            window.location = "https://snwbs.github.io/blog/";
        })
        .catch(err => console.log(err))
});

const $tbody = $("#tbody");
const $pushCommitForm = $("#pushCommitForm");
const $pushCommittext = $("#pushCommittext");

$pushCommitForm.submit(function (e) {
    e.preventDefault();
    alert("New commit Form Submitted !");
    const post = {
        commit: $pushCommittext.val(),
        time: Today.getFullYear()+ "/" + (Today.getMonth()+1) + "/" + Today.getDate() + "/" + Today.getHours() + ":" + Today.getMinutes()
    };
    db.collection("commitList/").add(post)
        .then(() => {
            window.location.reload();
        })
        .catch(err => console.log(err));
});

commitMap = {};
commitLen = 0;
db.collection("commitList")
  .get()
  .then((commitList) => {
    commitList.forEach((data) => {
      const commitId = commitLen;
      const commit = data.data();
      // Save tagId as a property of tagMap
      commitMap[commitId] = commit;
      commitLen += 1;
    });
    postAll();
  })
  .catch((err) => {
    console.log("[err]", err);
  });

function postAll() {
    console.log(commitMap);
    db
        .collection("blogList")
        .get()
        .then(blogList => {
            var i =0;
            blogList.forEach(doc => {
                const blog = doc.data();
                let message = ``;
                console.log("[blog]", blog);
                for (let i = 0; i < commitLen; i++) {
                    const commit = commitMap[i];
                    //console.log("tag", tag);
                    if (doc.id == commit.postid) {
                        console.log("Y");
                        message += `<span class="commits">
                        <span class="gray">anonymous:</span> ${commit.commit}
                            </span><br>`;
                    }
                }
                const col = `
                    <tr>
                            <th>${blog.Name}</th>
                            <th><div id = "${i}" class = "hi"></div></th>
                    </tr>
                    <tr>
                            <th><img src="${blog.picture}" width="600" height="450"></th> 
                            <th><p>${blog.detailed}</p></th>
                    </tr>
                    <tr>
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
}

db
    .collection("commitList")
    .get()
    .then(commitList => {
        var i =0;
        commitList.forEach(doc => {
            const commit = doc.data();
            console.log("[commit]", commit);
            const col = `
                <tr>
                        <th width="80%">${commit.commit}</th>
                        <th widht="20%">${commit.time}</th>
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
