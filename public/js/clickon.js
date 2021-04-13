$('.stockIndices,.niftyIndices,#getMoreInfo,.getClick').css('cursor','pointer') 
let close = true ;
const url = 'https://virtual-trading-1.herokuapp.com';
$('.niftyIndices').click(function(){
    const title = $(this).find('.symbol').text();
    const str = title.split(' ').splice(1).join('!');
    window.location.href = `${url}/nifty/${str}` ;
})
$('.stockIndices').click(function(){
    const title = $(this).find('.symbol').text();
    // const arr = title.split(' ')
    // let href ;
    // if(arr.length>1){
    //  href = arr.join('!')
    // }
    // else{
    //   href = arr[0]
    // }
    window.location.href = `${url}/${title}`
})
$('.stockIndices,.niftyIndices,#getMoreInfo').mouseover(function(){
   $(this).addClass('shadow')
})
$('.stockIndices,.niftyIndices,#getMoreInfo').mouseleave(function(){
  $(this).removeClass('shadow')
})
$('#getMoreInfo').click(function(){
  const suburl = window.location.href ;
  window.location.href = `${suburl}/details`
})
$('.getClick').click(function(){
  const href = $(this).attr('data-bs-href');
  window.location.href = `${url}/${href}` ;
})
function openNav() {
  document.getElementById("mySidepanel").style.width = "300px";
  close = false ;
}

/* Set the width of the sidebar to 0 (hide it) */
function closeNav() {
  document.getElementById("mySidepanel").style.width = "0";
  close = true ;
}
$('.navbar-brand').click(function(){
  if(close){
    openNav(); 
  }
  else{
    closeNav();
  }
})
window.addEventListener('click', function(e){   
  if (!document.getElementById('mySidepanel').contains(e.target)&&!document.querySelector('.navbar-brand').contains(e.target)){
    console.log('Outside')
    closeNav()
  }
});
const indices = [
  '50','next 50','bank','midcap 50','midcap 100',
  'midcap 150','auto','it','pharma',
  '100','200','500','smlcap 100',
   'smlcap 250','midsml 400','finsrv25 50',
  'fin service','fmcg','media','metal','energy','pharma','psu bank',
  'infra','pvt bank','realty','mnc','pse','serv sector'
]
const mydiv = document.getElementById("mySidepanel");
for(let indice of indices){
const aTag = document.createElement('a');
const href = indice.split(' ').join('!')
aTag.setAttribute('href',`/nifty/${href}`);
aTag.innerText = 'NIFTY '+indice.toUpperCase();
mydiv.appendChild(aTag);
}
setInterval(() => {
  window.location.reload()  
},30*1000);