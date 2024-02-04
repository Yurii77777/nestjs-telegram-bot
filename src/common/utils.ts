export const validateText = (text: string): boolean => {
  let result = false;

  //   Explanation:
  // ^ matches the start of the string.
  // [^\d\\/] matches any character that is not a digit (\d) or a forward slash (\/), thanks to the ^ inside the square brackets that negates the character class.
  // {2,} matches the previous pattern (any non-digit character except slash) two or more times. This ensures the minimum length of the string is two characters.
  // $ matches the end of the string.

  const isValid: boolean = /^[^\d\\/]{2,}$/.test(text);

  if (isValid) {
    return (result = true);
  }

  return result;
};

export const validateUserLastName = (userLastName: string): boolean => {
  let result = false;

  //   Explanation:
  //   ^: Matches the start of the string
  // [^\d\\/]*: Matches any character that is not a digit (\d), a forward slash (\/), or a backslash (\\), zero or more times
  // [a-zA-Zа-яА-ЯіІїЇ]: Matches any letter, including Cyrillic characters used in Ukrainian language (a-z, A-Z, а-я, А-Я, і, І, ї, Ї)
  // \s?: Matches an optional whitespace character
  // [^\d\\/]*: Same as the first instance, matches any character that is not a digit, a forward slash, or a backslash, zero or more times
  // [a-zA-Zа-яА-ЯіІїЇ]: Same as the first instance, matches any letter
  // [^\d\\/]*: Same as the first instance, matches any character that is not a digit, a forward slash, or a backslash, zero or more times
  // $: Matches the end of the string

  const isValid: boolean =
    /^[^\d\\/]*[a-zA-Zа-яА-ЯіІїЇ][^\d\\/]*\s?[^\d\\/]*[a-zA-Zа-яА-ЯіІїЇ][^\d\\/]*$/.test(
      userLastName,
    );

  if (isValid) {
    return (result = true);
  }

  return result;
};
