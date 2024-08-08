console.log("\x1bc");

const emailText = `yepp

On Thu, 8 Aug 2024 at 12:41, DURGESH KHADE <durgeshkhade001@gmail.com>
wrote:

> ahh
>
> On Wed, 7 Aug 2024 at 21:12, Radha Khade <radhakuade1980@gmail.com> wrote:
>
>> yess
>>
>> On Wed, 7 Aug 2024 at 21:12, DURGESH KHADE <durgeshkhade001@gmail.com>
>> wrote:
>>
>>> you there?
>>>
>>> On Wed, 7 Aug 2024 at 13:58, Radha Khade <radhakuade1980@gmail.com>
>>> wrote:
>>>
>>>> ::>????
>>>>
>>>> On Wed, 7 Aug 2024 at 13:56, Radha Khade <radhakuade1980@gmail.com>
>>>> wrote:
>>>>
>>>>> ???
>>>>>
>>>>> On Wed, 7 Aug 2024 at 13:21, Radha Khade <radhakuade1980@gmail.com>
>>>>> wrote:
>>>>>
>>>>>> niceeee
>>>>>>
>>>>>> On Wed, 7 Aug 2024 at 13:18, Radha Khade <radhakuade1980@gmail.com>
>>>>>> wrote:
>>>>>>
>>>>>>> wow
>>>>>>>
>>>>>>> On Wed, 7 Aug 2024 at 12:44, Radha Khade <radhakuade1980@gmail.com>
>>>>>>> wrote:
>>>>>>>
>>>>>>>> im glad
>>>>>>>>
>>>>>>>> On Wed, 7 Aug 2024 at 12:43, DURGESH KHADE <
>>>>>>>> durgeshkhade001@gmail.com> wrote:
>>>>>>>>
>>>>>>>>> :))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))D
>>>>>>>>>
>>>>>>>>> On Wed, 7 Aug 2024 at 12:42, DURGESH KHADE <
>>>>>>>>> durgeshkhade001@gmail.com> wrote:
>>>>>>>>>
>>>>>>>>>> Success!
>>>>>>>>>>
>>>>>>>>>> On Wed, 7 Aug 2024 at 12:40, Radha Khade <
>>>>>>>>>> radhakuade1980@gmail.com> wrote:
>>>>>>>>>>
>>>>>>>>>>> test email 1test email 1test email 1test email 1test email 1test
>>>>>>>>>>> email 1
>>>>>>>>>>>
>>>>>>>>>>
`;
function groupMessagesByQuotes(emailText) {
    // try {
    //     const lines = emailText.split("\n");
    //     const messages = [];
    //     let currentCount = -1;
    //     let currentMessage = "";
    //     let flag = false;
      
    //     lines.forEach((line) => {
    //     const match = line.match(/^(>*)/);
    //     const count = match[0].length;
      
    //     if (count !== currentCount) {
    //         flag = false;
    //         if (currentMessage) {
    //         currentMessage = currentMessage.replace(/^>*/gm, "");
    //         currentMessage = currentMessage.replace(/^\s*/gm, "");
    //         messages.unshift({message: currentMessage.trim()});
    //         }
    //         currentCount = count;
    //         currentMessage = line + "\n";
    //     } else {
    //         const dateRegex =
    //         /On [a-zA-Z]{3}, \d{1,2} [a-zA-Z]{3} \d{4} at \d{1,2}:\d{2}/;
    //         if (dateRegex.test(line)) {
    //         flag = true;
    //         }
    //         if (!flag) {
    //         currentMessage += line + "\n";
    //         }
    //     }
    //     });
      
    //     if (currentMessage) {
    //     currentMessage = currentMessage.replace(/^>*/gm, "");
    //     currentMessage = currentMessage.replace(/^\s*/gm, "");
    //     messages.unshift({message: currentMessage.trim()});
    //     }
        
    //     messages.shift();
    //     messages.shift();
    //     return messages;

    // } catch (error) {
    //     console.error('Error converting email to JSON:', error.message);
    //     return { error: error.message };
    // }
}

const messages = groupMessagesByQuotes(emailText);
console.log(messages);
