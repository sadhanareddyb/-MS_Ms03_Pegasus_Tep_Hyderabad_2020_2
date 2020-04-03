var timerFunction;

var imagePuzzle = {
    stepCount: 0,
    startTime: new Date().getTime(),

    //start game function initiated
    //display random image grid
    //step count is set to o

    startGame: function (images, gridSize) {
        this.setImage(images, gridSize);
        helper.doc('playPanel').style.display = 'block';
        helper.shuffle('sortable');
        this.stepCount = 0;
        this.startTime = new Date().getTime();
        this.tick();
    },
    //Tick method is once called from the start method and 
    //then calls to itself after each second  recursively 
    
    tick: function () {
        var now = new Date().getTime();
        var elapsedTime = parseInt((now - imagePuzzle.startTime) / 1000, 10);
        helper.doc('timerPanel').textContent = elapsedTime;
        timerFunction = setTimeout(imagePuzzle.tick, 1000);
    },
    // If gridSize is null or not passed, default it as 4.

    setImage: function (images, gridSize = 4) {
        var percentage = 100 / (gridSize - 1);
        var image = images[Math.floor(Math.random() * images.length)];
        helper.doc('imgTitle').innerHTML = image.title;
        helper.doc('actualImage').setAttribute('src', image.src);
        helper.doc('sortable').innerHTML = '';
        for (var i = 0; i < gridSize * gridSize; i++) {
            var xpos = (percentage * (i % gridSize)) + '%';
            var ypos = (percentage * Math.floor(i / gridSize)) + '%';

            let li = document.createElement('li');
            li.id = i;
            li.setAttribute('data-value', i);
            li.style.backgroundImage = 'url(' + image.src + ')';                                                               
            li.style.backgroundSize = (gridSize * 100) + '%';
            li.style.backgroundPosition = xpos + ' ' + ypos;
            li.style.width = 400 / gridSize + 'px';
            li.style.height = 400 / gridSize + 'px';

            ////set the attribute draagable is equals to true.

            li.setAttribute('draggable', 'true');
            li.ondragstart = (event) => event.dataTransfer.setData('data', event.target.id);
            li.ondragover = (event) => event.preventDefault();
            li.ondrop = (event) => {
                let origin = helper.doc(event.dataTransfer.getData('data'));
                let dest = helper.doc(event.target.id);
                let p = dest.parentNode;

                if (origin && dest && p) {//check the position of images
                    let temp = dest.nextSibling;
                    p.insertBefore(dest, origin);
                    p.insertBefore(origin, temp);

                    let vals = Array.from(helper.doc('sortable').children).map(x => x.id);
                    var now = new Date().getTime();
                    helper.doc('stepCount').textContent = ++imagePuzzle.stepCount;
                    document.querySelector('.timeCount').textContent = (parseInt((now - imagePuzzle.startTime) / 1000, 10));

                    if (isSorted(vals)) {//check all the broken images or sorted is true means game over

                        helper.doc('actualImageBox').innerHTML = helper.doc('gameOver').innerHTML;
                        helper.doc('stepCount').textContent = imagePuzzle.stepCount;
                    }
                }
            };
            li.setAttribute('dragstart', 'true');
            helper.doc('sortable').appendChild(li);
        }
        //ramdomizing the broken parts

        helper.shuffle('sortable');
    }
};

isSorted = (arr) => arr.every((elem, index) => { return elem == index; });

var helper = {
    doc: (id) => document.getElementById(id) || document.createElement("div"),

    shuffle: (id) => {
        var ul = document.getElementById(id);
        for (var i = ul.children.length; i >= 0; i--) {
            ul.appendChild(ul.children[Math.random() * i | 0]);
        }
    }
}
