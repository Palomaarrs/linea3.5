var items = document.querySelectorAll(".inview-item");

items.forEach(function (item) {
    new Waypoint.Inview({
        element: item,
        enter: function (direction) {
            console.log('Enter triggered with direction ' + direction)
        },
        entered: function (direction) {
            item.classList.add('inview');
            console.log('Entered triggered with direction ' + direction)
        },
        exit: function (direction) {
            console.log('Exit triggered with direction ' + direction)
        },
        exited: function (direction) {
            item.classList.remove('inview');
            console.log('Exited triggered with direction ' + direction)
        }
    })
})
