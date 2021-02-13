//

let count = (char, str) => [...str].filter(i => i == char).length;
let mob = ('orientation' in window);
let getcss = (query, style) => getComputedStyle(document.querySelector(query)).getPropertyValue(style);

let msgwin = $('#messages'); // get msg window
let base = $('#base');
let stat = 'Ming Chat';

socket.on('connect', () => socket.emit('join', {}));

socket.on('status', function(data) {
    base.before('<center><p class="status">' + data.msg + '</p></center><br>');
    msgwin.scrollTop(msgwin[0].scrollHeight);
});


socket.on('message', function(data) {

    msg = data.msg.replace(/\n/g, '<br>')

    if (data.user != localStorage.user) {
        // main.append(`<br><p class="received"><span class="usr">${data.user}</span></br>${data.msg}</p><br>`);

        botImg = $('#logo').clone(); // create <img>
        botImg.addClass('botimg');

        msgbox = $(`<p align="left" class="received"></p>`); // create the botbox

        msgbox.prepend(botImg);
        msgbox.append(msg);

        if (document.hidden) {
            stat = data.user + 'messaged';
            new Notification(data.user, { body: data.msg, icon: botimg.attr('src') });
        }
    } else
        msgbox = $('<p align="right" class="sent">' + msg + '</p>');


    base.before(msgbox); // add it to msg element
    msgwin.scrollTop(msgwin[0].scrollHeight * 2);

    UI();
});


window.onbeforeunload = function leave_room() {
    socket.emit('left', {}, function() {
        socket.disconnect();
        location.href = "/"; // redirect('/')
    });
};


document.onvisibilitychange = function() {
    // To be editted as like fb (flickering document.title)
};


function UI() {
    p = document.querySelectorAll('p.sent, p.received');
    _p = p[p.length - 1];

    if (_p.class == 'sent')
        $(_p).css('margin-left', window.innerWidth - $(this).width);
    else
        $(_p).css('margin-right', window.innerWidth - $(this).width);
}

/*______________ jQuery methods ________*/

$(function() {

    function send() {
        let txt = $('#text');
        let text = txt.val().trim();

        if (text) {
            socket.emit('text', { msg: text });

            txt.val('');
            txt.attr('rows', '1');
        }
    }

    $('#send').click(send);

    $('#text')
        .keydown(function(e) {

            if (e.which == 13) {

                if (this.rows < 4)
                    this.rows = String(++this.rows);

                if (e.shiftKey) { // Shift + Enter
                    e.preventDefault();
                    send();
                }

            }
            if (e.which == 9) { // Tab
                e.preventDefault();
                this.value += '    ';
            }

            if (e.which == 8 || e.which == 46) { // Backspace | Delete
                let n = count('\n', this.value) + 1;
                if (n < this.rows)
                    this.rows = String(n);
            }

            if ([32, 9, 10, 13, 11, 12].includes(e.which)) { // on whitespace type
                if (!$('#text').val()) // on empty textarea
                    e.preventDefault();
            }

        })
        .keyup(function(e) {});

    $('#messages').height(window.innerHeight - $('footer').height());

    if (mob) { $('body').css({ margin: 0, padding: 0 }) }

    $('#plus').click(function() {

        let txt = 'https://preming.herokuapp.com/enter/' + localStorage.room;

        let copyText = $('<div>' + txt + '</div>')[0]

        copyText.select();
        copyText.setSelectionRange(0, 99999); /* For mobile devices */

        /* Copy the text inside the text field */
        document.execCommand("copy");

        /* Alert the copied text */
        alert("link Copied: " + copyText);
    })

});


/* Text Copy function */

// function myFunction() {
//     /* Get the text field */
//     var copyText = document.getElementById("myInput");

//     /* Select the text field */
//     copyText.select();
//     copyText.setSelectionRange(0, 99999); /* For mobile devices */

//     /* Copy the text inside the text field */
//     document.execCommand("copy");

//     /* Alert the copied text */
//     alert("Copied the text: " + copyText.value);
// }