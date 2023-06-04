
$(document).ready(function() {
    getMessages();
    // date format
    let date = new Date();
    let dateFormat = date.toLocaleDateString('vn', {
        year: "numeric",
        month: "2-digit",
        day: "numeric",
    }).replace(/\//g, '-');

    let socket = io(ip_address + ':' + socket_port);
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Join room
    socket.emit('joinRoom', roomChat.name, userLogin.name);

    $(document).on('click', '#btn-chat', function(e) {
        const message = {
            from: userLogin.id,
            avatar: userLogin.avatar,
            content: $("#input-message").val(),
            room_id: roomChat.id
        };

        if ($("#input-message").val()) {
            sendMessageToServer(message);
            $("#input-message").val("");

        }
    });

    $("#file").change(function() {
        let file = $(this).prop('files');
        if(file.length > 0){
            let src = URL.createObjectURL(file[0]);
            $("#img-preview").attr("src", src);
            $("#img-preview").show();
        }
    });

    $('.close-modal').click(function() {
        $("#form-send-message").trigger("reset");
        $("#img-preview").hide();
    });

    $('.uploadImage').click(function() {
        let data = $("#input-message").val();
        $("#message").val(data);
    });

    $("#send-modal-message").click(function() {
        if ($("#file").prop('files')[0] && $("#message").val()) {
            uploadTOFirebase($("#file").prop('files')[0]);
        }
    });

    socket.on('message', (message) => {
        listMessage(message);
        scrollMessages();
    });

    function sendMessageToServer(message) {
        socket.emit("chat", message);
        sendMessage(message);
        scrollMessages();
    }

    function listMessage(message) {
        let element = document.getElementById('messages');
        let data = null;
        if (message.leave) {
            data = `<div class="chat-message user-join text-center font-semibold text-red-600">
                        ${message.leave}
                    </div>`;
        } else if (message.join) {
            data = `<div class="chat-message user-join text-center font-semibold text-blue-600">
                           ${message.join}
                        </div>`;
        } else if (message.welcome) {
            data = `<div class="flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3" role="alert">
                        <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/></svg>
                        <p>${message.welcome}</p>
                    </div>`;

        } else if(message.content) {
            let avatarDefault = "https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144";
            data = `<div class="chat-message">
                        <div class="flex items-end ${message.from === userLogin.id ? 'justify-end' : ''}">
                            <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-${message.from === userLogin.id ? '1' : '2'} items-start">
                                <div>
                                    <span class="px-4 py-2 rounded-lg inline-block rounded-bl-none ${message.from === userLogin.id ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}">${message.content}</span>
                                </div>
                                ${message.file ? '<img class="rounded-t-lg rounded-lg" src="' + message.file + '" alt="" />' : ''}
                            </div>
                            <img src="${message.avatar ?? avatarDefault}"
                                alt="My profile" class="w-6 h-6 rounded-full order-1">
                        </div>
                    </div>`;
        }

        element.innerHTML += data;
    }

    function getMessages() {
        let url = urlGetMessage
        $.ajax({
            type: "GET",
            url: url,
            dataType: "JSON",
            success: function (data) {
                let message = data;
                for (let i = 0; i < message.length; i++) {
                    listMessage(message[i]);
                }
            },
        });
    }

    function sendMessage(message) {
		$.ajax({
            type: "POST",
            url: urlSend,
            data: message,
			dataType: "JSON",
            success: function (data) {
            },
        });
    }

    function uploadTOFirebase(file) {
        let ref = firebase.storage().ref();
        let nameFileCustom = (file.name).substr(0, (file.name).lastIndexOf('.')) +  dateFormat;
        let typeFile = 'PNG';
        let nameFile = nameFileCustom + '.' + typeFile;
        let metadata = {
            contentType: file.type
        };

        let upload = ref.child(`Students/${nameFile}`).put(file, metadata);
        upload
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => {
                let data = url;
                handelSendMessage(data);
            })
            .catch(console.error);
    }

    function handelSendMessage(urlImage) {
        const message = {
            from: userLogin.id,
            avatar: userLogin.avatar,
            content: $("#message").val(),
            room_id: roomChat.id,
            file: urlImage,
        };

        sendMessageToServer(message);
        $(".close-modal").trigger("click");
    }

    scrollMessages();
    function scrollMessages() {
        setTimeout(() => {
            let element = document.getElementById('messages');
            element.scrollTo(0, element.scrollHeight);
        }, 500)
    }
});
