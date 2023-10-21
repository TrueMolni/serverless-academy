const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getUserInput() {
  rl.question(
    'Hello! Enter few words or numbers separated by space (or type "exit" to quit): ',
    (input) => {
      if (input.toLowerCase() === "exit") {
        rl.close();
      } else {
        const values = input.split(" ").filter((val) => val.trim() !== "");
        processUserInput(values);
      }
    }
  );
}

function processUserInput(values) {
  rl.question(
    "\nHow would you like to sort values ?: \n1.Sort words alphabetically.\n2.Show numbers from lesser to greater.\n" +
      "3. Show numbers from bigger to smaller.\n4. Display words in ascending order by number of letters in the word.\n" +
      "5. Show only unique words.\n6. Display only unique values.\n\nSelect (1 - 5) and press ENTER: ",
    (choice) => {
      switch (parseInt(choice)) {
        case 1:
          console.log(
            "Sorted words alphabetically:",
            values
              .filter((val) => isNaN(val))
              .sort()
              .join(" ")
          );
          break;
        case 2:
          console.log(
            "Numbers from lesser to greater:",
            values
              .filter((val) => !isNaN(val))
              .sort((a, b) => a - b)
              .join(" ")
          );
          break;
        case 3:
          console.log(
            "Numbers from bigger to smaller:",
            values
              .filter((val) => !isNaN(val))
              .sort((a, b) => b - a)
              .join(" ")
          );
          break;
        case 4:
          console.log(
            "Words in ascending order by number of letters:",
            values.sort((a, b) => a.length - b.length).join(" ")
          );
          break;
        case 5:
          console.log(
            "Unique words:",
            [...new Set(values)].filter((val) => isNaN(val)).join(" ")
          );
          break;
        case 6:
          console.log(
            "Unique values:",
            [
              ...new Set(values.filter((val) => !isNaN(val) || isNaN(val))),
            ].join(" ")
          );
          break;
        default:
          console.log("Invalid choice. Please try again.");
      }
      getUserInput();
    }
  );
}

getUserInput();
