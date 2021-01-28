$(function() { // Adding the pre-requisite...

    $('body').append(`
        <!-- The Modal -->
        <div id="tech">
        <div id="myModal" class="modal" hidden>

            <!-- Modal content -->
            <div class="modal-box">
                <span class="close">&times;</span>
                <div></div>
            </div>
        </div></div>
        `);

    var modal = $("#myModal"); // Get the modal
    var content = $('.modal-box div') // Get the modal box

    function alter(val, alt = null) {
        // To evaluate a function returning text/html in mod-(text/html)
        try {
            return eval(val)
        } catch {
            return !alt ? val : alt
        }
    }

    // When the user clicks the button, open the modal 
    $(".modalbtn").click(function() {
        content.children().remove(); // empty the content
        content.text(alter($(this).attr('mod-text'))); // add text if 'mod-text'
        content.html(alter($(this).attr('mod-html'))); // add html if 'mod-html'
        modal.fadeIn(150); // make it appear with a fading effect
    });

    // When the user clicks on <span> (x), close the modal
    $(".close").click(() => {
        modal.fadeOut(100);
        content.children().remove()
    });

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = e => e.target == document.getElementById('myModal') ? modal.fadeOut(100) : null;

    /*
        <h2>Usage</h2>
        <button class="modalbtn" mod-text="Can be used to create custom alerts;
        Use 'mod-text=$(element).text()' to add another elements text">mod-text</button>
        <button class="modalbtn" mod-html="Can be used to create custom windows;<br>
        Use 'mod-html=$(element).html()' to add another elements text">mod-html</button>
        <br><br><br>


        <h2>Example</h2>
        <input type="text" id="inp" placeholder="$('#inp').val()">
        <button class="modalbtn" mod-text="$('#inp').val()">mod-text</button><br>

        <p>Any element's (here the documen)'s html using <b>"$('#markup').html"</b>
            <button class="modalbtn" mod-html="$('#markup').html()">
                mod-html
            </button>
        </p>

    */
});