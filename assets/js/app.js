const cl=console.log

const formContainer=document.getElementById('formContainer')
const titleControl=document.getElementById('title')
const bodyControl=document.getElementById('body')
const userIdControl=document.getElementById('userId')
const addBtn=document.getElementById('addBtn')
const updateBtn=document.getElementById('updateBtn')
const postContainer=document.getElementById('postContainer')
const spinner=document.getElementById('spinner')

let POST_URL='https://jsonplaceholder.typicode.com/'
let BASE_URL='https://jsonplaceholder.typicode.com/posts'
let postArr=[];

function snackBar(msg,i){
  Swal.fire({
    title:msg,
    icon:i,
    timer:3000
  }) 
}

function tooltips(){
 
  $('[data-toggle="tooltip"]').tooltip()

}
function templating(arr){
    let res=''
    arr.forEach(p=>{
        res+=` <div class="col-md-3 mt-5" id="${p.id}">
                <div class="card h-100">
                    <div class="card-header" data-toggle="tooltip" data-placement="top" title="${p.title}">
                        <h3>${p.title}</h3>
                    </div>
                    <div class="card-body">
                        <p>${p.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <i onclick="onEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-primary"
                        data-toggle="tooltip" data-placement="top" title="Edit Post"></i>
                        <i onclick="onRemove(this)"  class="fa-solid fa-trash-can fa-2x text-danger"
                        ata-toggle="tooltip" data-placement="top" title="Delete Post"></i>
                    </div>
                </div>
            </div>`
    })
    postContainer.innerHTML=res
    tooltips()
}
function fetchPosts(){
    spinner.classList.remove('d-none')
    let xhr=new XMLHttpRequest()
    xhr.open('GET',BASE_URL);
    xhr.send(null)
    xhr.onload=function(){
        if(xhr.status>=200 && xhr.status<=299){
            let res=JSON.parse(xhr.response)
            postArr=res
           
            templating(res.reverse())
         spinner.classList.add('d-none')

        }else{
           spinner.classList.add('d-none')

            snackBar('Something went wrong..','error')
        }
    }
}
fetchPosts()

function createPosts(ele){
    spinner.classList.remove('d-none')
    ele.preventDefault()
    let new_post={
        title:titleControl.value ,
        body:bodyControl.value,
        userId:userIdControl.value
    }
    let xhr=new XMLHttpRequest()
    xhr.open('POST',BASE_URL)
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(JSON.stringify(new_post))
    xhr.onload=function(){
        if(xhr.status>=200 && xhr.status<=299){
            let res=JSON.parse(xhr.response)
            let col=document.createElement('div')
            col.className=`col-md-3 mt-5`
            col.id=res.id
            col.innerHTML=`  <div class="card h-100">
                    <div class="card-header" data-toggle="tooltip" data-placement="top" title="${new_post.title}">
                        <h3>${new_post.title}</h3>
                    </div>
                    <div class="card-body">
                        <p>${new_post.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <i onclick="onEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-primary"
                        data-toggle="tooltip" data-placement="top" title="Edit Post"></i>
                        <i onclick="onRemove(this)"  class="fa-solid fa-trash-can fa-2x text-danger"
                        data-toggle="tooltip" data-placement="top" title="Delete Post"></i>
                    </div>
                </div>`
                postContainer.prepend(col)
                formContainer.reset()
                spinner.classList.add('d-none')
                tooltips()
                snackBar(`New Post with Id ${res.id} Created Successfully`,'success')
        }else{
                spinner.classList.add('d-none')
                snackBar('Something went wrong..','error')
                
        }
    }
}

function onRemove(ele){
    let REMOVE_ID= ele.closest('.col-md-3').id
    Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
    

    spinner.classList.remove('d-none')
     let REMOVE_URL=`${BASE_URL}/${REMOVE_ID}`
     let xhr=new XMLHttpRequest()
     xhr.open('DELETE',REMOVE_URL)
     xhr.send(null)
    xhr.onload=function(){
        if(xhr.status>=200 && xhr.status<=299){
            document.getElementById(REMOVE_ID).remove()
            spinner.classList.add('d-none')
            snackBar(`New Post ${REMOVE_ID} deleted Successfully`,'success')

        }else{
            spinner.classList.add('d-none')
                snackBar('Something went wrong..','error')
        }
    }

  }
});
}

function onEdit(ele){
    spinner.classList.remove('d-none')
    let EDIT_ID=ele.closest(".col-md-3").id
    localStorage.setItem('EDIT_ID',EDIT_ID)
    let EDIT_URL=`${BASE_URL}/${EDIT_ID}`
    let xhr=new XMLHttpRequest()
    xhr.open('GET',EDIT_URL)
    xhr.send(null)
    xhr.onload=function(){
        if(xhr.status>=200 && xhr.status<=299){
            let res=JSON.parse(xhr.response)
            titleControl.value=res.title;
            bodyControl.value=res.body;
            userIdControl.value = res.userId;

            formContainer.scrollIntoView({
                behavior:'smooth',
                block:'center'
                
            })
              spinner.classList.add('d-none')
            addBtn.classList.add('d-none')
            updateBtn.classList.remove('d-none')

        }else{
            spinner.classList.add('d-none')
            snackBar('Something went wrong..','error')

        }
    }
}
function onUpdatePost(){
    spinner.classList.remove('d-none')
    let  UPDATE_ID=localStorage.getItem('EDIT_ID')
    let UPDATE_URL=`${BASE_URL}/${UPDATE_ID}`
    let Update_post={
        title:titleControl.value,
        body:bodyControl.value,
        userId:userIdControl.value
    }
    let xhr=new XMLHttpRequest()
    xhr.open('PATCH',UPDATE_URL)
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(JSON.stringify(Update_post))
    xhr.onload=function(){
        if(xhr.status>=200 && xhr.status<=299){
            let res=JSON.parse(xhr.response)
            let col=document.getElementById(UPDATE_ID)
            col.querySelector('h3').innerHTML=Update_post.title
            col.querySelector('p').innerHTML=Update_post.body
            
            let header = col.querySelector('.card-header');

            header.setAttribute('title', Update_post.title);

            $(header).tooltip('dispose');
            $(header).tooltip();

            let updatePost=document.getElementById(UPDATE_ID)
            updatePost.classList.add('bg')
            updatePost.scrollIntoView({
                behavior:'smooth',
                block:'center'
            })

            setTimeout(() => {
                updatePost.classList.remove('bg')
            }, 8000);
            formContainer.reset()
            spinner.classList.add('d-none')
            addBtn.classList.remove('d-none')
            updateBtn.classList.add('d-none')


            snackBar(`'The Post with Id ${UPDATE_ID} Updated succeessfully..`,'success')
        }else{
            spinner.classList.add('d-none')
            snackBar('Something went wrong..','error')

        }
    }
}
formContainer.addEventListener('submit',createPosts)
updateBtn.addEventListener('click',onUpdatePost)