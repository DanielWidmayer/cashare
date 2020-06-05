var messages;
var currentChatPartnerID;
var messageBody = document.querySelector('#messageBody');

$(document).ready(function () {
    // scroll to bottom of messages
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;

    $('#messageInput').keypress(function (e) {
        if (e.which == 13) {
            // post
            postMessage(currentChatPartnerID); // to current chat partner ID
            return false;
        }
    });

    $('#sendMessageButton').click(() => {
        // post
        postMessage(currentChatPartnerID); // // to current chat partner ID
    });

    function postMessage(user_receive_id) {
        var messageData = {};
        var d = new Date(); // build datetime format: yyyy-mm-dd hh:mm:ss
        var fullTime = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        var fullDate = d.getFullYear() + '-' + (('' + (d.getMonth() + 1)).length < 2 ? '0' : '') + (d.getMonth() + 1) + '-' + (('' + d.getDate()).length < 2 ? '0' : '') + d.getDate();
        messageData['timestamp'] = fullDate + ' ' + fullTime;
        messageData['text'] = $('#messageInput').val();
        messageData['user_receive_id'] = user_receive_id;
        messageData['group_id'] = null;
        // now post the created messageData to server
        $.ajax({
            url: '/chat/sendMessage',
            data: messageData,
            type: 'POST',
            success: function (data) {
                $('#messageBody').append('<div class="outgoing_msg"><div class="sent_msg"><p>' + messageData['text'] + '</p><span class="time_date">' + beautifyTime(messageData['timestamp']) + '</span></div></div>');
                messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
                $('#messageInput').val('');
                // update inbox
                var currentChatUserName = $('#user' + messageData['user_receive_id'])
                    .find('h5')
                    .html()
                    .split('<')[0]
                    .split(' ');
                var condition = $('#user' + messageData['user_receive_id'])
                    .html()
                    .indexOf('<div class="profilepic');

                if (condition < 0) {
                    var currentChatUserProfilePic = '<i class="btn btn-primary btn-circle fa fa-user inboxpic mr-5"></i>';
                } else {
                    var currentChatUserProfilePic = $('#user' + messageData['user_receive_id'])
                        .html()
                        .split('img/profiles/')[1]
                        .split(');">')[0];
                    // configure the div with profilepic as background
                    currentChatUserProfilePic = '<div class="profilepic profilepic-md" style="background-image: url(/static/img/profiles/' + currentChatUserProfilePic + ');"></div>';
                }

                $('#user' + messageData['user_receive_id']).replaceWith(
                    '<button id="user' +
                        messageData['user_receive_id'] +
                        '" class="btn chat_list active_chat"><div class="chat_people"><div class="chat_img">' +
                        currentChatUserProfilePic +
                        '</div><div class="chat_ib"><h5 class="ml-3">' +
                        currentChatUserName[0] +
                        ' ' +
                        currentChatUserName[1] +
                        '<span class="chat_date">' +
                        beautifyTime(messageData['timestamp']) +
                        '</span></h5><p class="ml-3">' +
                        messageData['text'] +
                        '</p></div></div></button>'
                );
            },
            error: function (request, error) {
                console.log(error + 'Request:' + JSON.stringify(request));
            },
        });
    }

    // ajax calls that are being executed on load for simplicity
    // get usermails and Messages that user has either sent or received
    var inboxData = {};
    $.ajax({
        url: '/chat/messages',
        type: 'GET',
        success: function (data) {
            messages = data;
            // filter all messages to create inbox data
            for (const key in messages) {
                if (messages[key]['user_receive_id'] != $('#userid').text()) {
                    inboxData[messages[key]['user_receive_id']] = { message_id: messages[key]['message_id'], text: messages[key]['text'], timetag: messages[key]['timetag'] };
                } else if (messages[key]['user_receive_id'] == $('#userid').text()) {
                    inboxData[messages[key]['user_send_id']] = { message_id: messages[key]['message_id'], text: messages[key]['text'], timetag: messages[key]['timetag'] };
                }
            }
            // create inbox from inboxData
            for (const key in inboxData) {
                $.ajax({
                    url: '/chat/userDataById',
                    data: { data: key },
                    type: 'POST',
                    success: function (data) {
                        var profilepic;
                        if (data[6] == null) {
                            profilepic = '<i class="btn btn-primary btn-circle fa fa-user inboxpic mr-5"></i>';
                        } else {
                            profilepic = '<div class="profilepic profilepic-md" style="background-image: url(/static/img/profiles/' + data[6] + ');"></div>';
                        }
                        var ariaTimeValue = inboxData[key]['timetag'].split('.')[0].replace(/[-T:\.Z]/g, '');
                        var insertNewInbox =
                            '<button id="user' +
                            data[0] +
                            '" class="btn chat_list" aria-label="' +
                            ariaTimeValue +
                            '"><div class="chat_people"><div class="chat_img">' +
                            profilepic +
                            '</div><div class="chat_ib"><h5 class="ml-3">' +
                            data[1] +
                            ' ' +
                            data[2] +
                            '<span class="chat_date">' +
                            beautifyTime(inboxData[key]['timetag']) +
                            '</span></h5><p class="ml-3">' +
                            inboxData[key]['text'] +
                            '</p></div></div></button>';
                        if ($('.inbox_chat').children('button').length == 0) {
                            $('.inbox_chat').prepend(insertNewInbox);
                        } else {
                            var valueSet = false;
                            // now search through inbox chat elements to insert chats chronological
                            $('.inbox_chat')
                                .children('button')
                                .each(function () {
                                    // compare aria-stored time values
                                    if (this.getAttribute('aria-label') < ariaTimeValue && valueSet == false) {
                                        // insert newer Chat before
                                        $(this).before(insertNewInbox);
                                        valueSet = true;
                                    }
                                });
                            // if no value was set bc its timestamp was older than all, append to the end
                            if (!valueSet) {
                                $('.inbox_chat').append(insertNewInbox);
                            }
                        }
                        $('#user' + key).click(() => {
                            $('button.active_chat').removeClass('active_chat');
                            $('#user' + key).addClass('active_chat'); //add the class to the clicked element
                            loadMessagesIntoMessageBody(data);
                        });
                    },
                    error: function (request, error) {
                        console.log(error + 'Request:' + JSON.stringify(request));
                    },
                });
            }
        },
        error: function (req, err) {
            console.log(error + 'Request:' + JSON.stringify(request));
        },
    });

    $.ajax({
        url: '/chat/user',
        type: 'GET',
        success: function (data) {
            autocomplete(document.getElementById('searchUserInput'), data);
        },
        error: function (request, error) {
            console.log(error + 'Request:' + JSON.stringify(request));
        },
    });

    $('#searchUserButton').click(() => {
        var searchData = $('#searchUserInput').val();
        // post search Data from Mail to console
        $.ajax({
            url: '/chat/userdata',
            data: { data: searchData },
            type: 'POST',
            success: function (data) {
                // use the userdata for a new chat
                var latestMessage = loadMessagesIntoMessageBody(data);
                $('button.active_chat').removeClass('active_chat');
                var time, latestMessage, profilepic;
                if (messages[latestMessage] == undefined) {
                    time = '';
                    latestMessage = '';
                } else {
                    time = beautifyTime(messages[latestMessage]['timetag']);
                    latestMessage = messages[latestMessage]['text'];
                }
                if (data[6] == null) {
                    profilepic = '<i class="btn btn-primary btn-circle fa fa-user inboxpic mr-5"></i>';
                } else {
                    profilepic = '<div class="profilepic profilepic-md" style="background-image: url(/static/img/profiles/' + data[6] + ');"></div>';
                }
                var newInbox =
                    '<button id="user' +
                    data[0] +
                    '" class="btn chat_list active_chat"><div class="chat_people"><div class="chat_img">' +
                    profilepic +
                    '</div><div class="chat_ib"><h5 class="ml-3">' +
                    data[1] +
                    ' ' +
                    data[2] +
                    '<span class="chat_date">' +
                    time +
                    '</span></h5><p class="ml-3">' +
                    latestMessage +
                    '</p></div></div></button>';
                if ($('#user' + data[0]).length) {
                    $('#user' + data[0]).replaceWith(newInbox);
                } else {
                    $('.inbox_chat').prepend(newInbox);
                }
            },
            error: function (request, error) {
                console.log(error + 'Request:' + JSON.stringify(request));
            },
        });
    });
});

function loadMessagesIntoMessageBody(data) {
    // data[0] is the ID of the user that we have been searching for
    var currentUserID = $('#userid').text(); // get userid of the current user to check if msg was send or received
    currentChatPartnerID = data[0];
    var latestMessage;
    $('#messageBody').empty();
    for (i in messages) {
        if (messages[i]['user_receive_id'] == data[0] || messages[i]['user_send_id'] == data[0]) {
            if (currentUserID == currentChatPartnerID) {
                if (messages[i]['user_receive_id'] == data[0] && messages[i]['user_send_id'] == data[0]){
                    $('#messageBody').append('<div class="outgoing_msg"><div class="sent_msg"><p>' + messages[i]['text'] + '</p><span class="time_date">' + beautifyTime(messages[i]['timetag']) + '</span></div></div>');
                    latestMessage = i;
                }
            }
            else if (currentUserID == messages[i]['user_send_id']) {
                // message was send by current user -> outgoing msg
                $('#messageBody').append('<div class="outgoing_msg"><div class="sent_msg"><p>' + messages[i]['text'] + '</p><span class="time_date">' + beautifyTime(messages[i]['timetag']) + '</span></div></div>');
                latestMessage = i;
            } else {
                var profilepic;
                if (data[6] == null) {
                    profilepic = '<i class="btn btn-primary btn-circle fa fa-user fa-fw"></i>';
                } else {
                    profilepic = '<div class="profilepic profilepic-sm" style="background-image: url(/static/img/profiles/' + data[6] + ');"></div>';
                }
                //message was send by other user
                $('#messageBody').append(
                    '<div class="incoming_msg"><div class="incoming_msg_img">' +
                        profilepic +
                        '</div>' +
                        '<div class="received_msg"><div class="received_withd_msg"><p>' +
                        messages[i]['text'] +
                        '</p><span class="time_date">' +
                        beautifyTime(messages[i]['timetag']) +
                        '</span></div></div></div>'
                );
                latestMessage = i;
            }
            messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
        }
    }
    return latestMessage;
}

// function beautifyTime(datetime) {
//     if ((datetime[6] = '')) return '';
//     var d = new Date(); // build datetime format: yyyy-mm-dd hh:mm:ss
//     datetime = datetime.split(/(T|\.|:|-| )/);
//     // beautify time
//     if (d.getFullYear() - parseInt(datetime[0]) || d.getMonth() + 1 - parseInt(datetime[2]) || d.getDate() - parseInt(datetime[4]) > 1) {
//         return datetime[4] + '.' + datetime[2] + '.' + datetime[0];
//     } else if (d.getDate() - parseInt(datetime[4]) == 1) {
//         return 'yesterday';
//     } else if (d.getHours() - parseInt(datetime[6])) {
//         return datetime[6] + ':' + datetime[8] + ' | Today';
//     } else if (!(d.getMinutes() - parseInt(datetime[8]))) {
//         return 'now';
//     } else {
//         return d.getMinutes() - parseInt(datetime[8]) + ' min';
//     }
// }
