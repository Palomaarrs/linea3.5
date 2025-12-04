    const title=document.querySelector('.fijoindex');
    window.addEventListener('scroll',function(){
        const scrollY=window.scrollY;
        const maxScroll=document.body.getBoundingClientRect().height-window.innerHeight;
        // Maxscroll=900 

        // x= scrollY * 800/maxScroll
        const x=scrollY * 800 / maxScroll;
        title.style.fontVariationSettings=`'wght' ${100 + x}`;
        console.log(x);
    });