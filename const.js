export const AVAILABLE_LANGUAGES = [
  'JAVA', 'JAVASCRIPT',
];

export const GAME_TYPES = [
  'NORMAL',
  'CODE_GOLF',
];

export const CODEMIRROR_MODES = {
  JAVA: 'text/x-java',
  JAVASCRIPT: 'text/javascript',
};

export const BASE_CODES = {
  JAVA: 'import java.util.Scanner;\n' +
    '\n' +
    'class Solution { // do not change the className\n' +
    '    public static void main(String[] args) {\n' +
    '        Scanner scanner = new Scanner(System.in);\n' +
    '        // you can access the input parameters with\n' +
    '        // scanner.nextInt(), scanner.nextLine(), etc..\n' +
    '    }\n' +
    '}',
  JAVASCRIPT: 'let TODO = true;',
};
