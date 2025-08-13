import { CppStyle } from "@/components/CodeGenerator";

interface CppTemplate {
  includes: string[];
  functions: string[];
  main: string;
}

export const generateCppCode = (prompt: string, style: CppStyle): string => {
  const template = generateTemplate(prompt, style);
  return formatCode(template, style);
};

const generateTemplate = (prompt: string, style: CppStyle): CppTemplate => {
  const lowerPrompt = prompt.toLowerCase();
  
  // Simple pattern matching for common program types
  if (lowerPrompt.includes('calculator')) {
    return generateCalculatorTemplate(style);
  } else if (lowerPrompt.includes('array') || lowerPrompt.includes('list')) {
    return generateArrayTemplate(style);
  } else if (lowerPrompt.includes('class') || lowerPrompt.includes('object')) {
    return generateClassTemplate(style);
  } else if (lowerPrompt.includes('file') || lowerPrompt.includes('read') || lowerPrompt.includes('write')) {
    return generateFileTemplate(style);
  } else if (lowerPrompt.includes('sort') || lowerPrompt.includes('search')) {
    return generateAlgorithmTemplate(style);
  } else {
    return generateBasicTemplate(style);
  }
};

const generateCalculatorTemplate = (style: CppStyle): CppTemplate => {
  const funcName = style.naming === 'snake_case' ? 'perform_operation' : 
                   style.naming === 'PascalCase' ? 'PerformOperation' : 'performOperation';
  
  return {
    includes: ['<iostream>', '<iomanip>'],
    functions: [
      `double ${funcName}(double a, double b, char op) {
    switch(op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': 
            if(b != 0) return a / b;
            else {
                std::cout << "Error: Division by zero!" << std::endl;
                return 0;
            }
        default:
            std::cout << "Error: Invalid operation!" << std::endl;
            return 0;
    }
}`
    ],
    main: `std::cout << "Simple Calculator" << std::endl;
    std::cout << "=================" << std::endl;
    
    double num1, num2;
    char operation;
    
    std::cout << "Enter first number: ";
    std::cin >> num1;
    
    std::cout << "Enter operation (+, -, *, /): ";
    std::cin >> operation;
    
    std::cout << "Enter second number: ";
    std::cin >> num2;
    
    double result = ${funcName}(num1, num2, operation);
    
    std::cout << std::fixed << std::setprecision(2);
    std::cout << "Result: " << num1 << " " << operation << " " << num2 << " = " << result << std::endl;`
  };
};

const generateArrayTemplate = (style: CppStyle): CppTemplate => {
  const funcName = style.naming === 'snake_case' ? 'display_array' : 
                   style.naming === 'PascalCase' ? 'DisplayArray' : 'displayArray';
  
  return {
    includes: ['<iostream>', '<vector>', '<algorithm>'],
    functions: [
      `void ${funcName}(const std::vector<int>& arr) {
    std::cout << "Array elements: ";
    for(const auto& element : arr) {
        std::cout << element << " ";
    }
    std::cout << std::endl;
}`
    ],
    main: `std::vector<int> numbers = {64, 34, 25, 12, 22, 11, 90};
    
    std::cout << "Original ";
    ${funcName}(numbers);
    
    std::sort(numbers.begin(), numbers.end());
    
    std::cout << "Sorted ";
    ${funcName}(numbers);`
  };
};

const generateClassTemplate = (style: CppStyle): CppTemplate => {
  const className = style.naming === 'snake_case' ? 'student_record' : 
                    style.naming === 'PascalCase' ? 'StudentRecord' : 'StudentRecord';
  
  return {
    includes: ['<iostream>', '<string>'],
    functions: [
      `class ${className} {
private:
    std::string name;
    int age;
    double grade;

public:
    ${className}(std::string n, int a, double g) : name(n), age(a), grade(g) {}
    
    void display() const {
        std::cout << "Name: " << name << ", Age: " << age << ", Grade: " << grade << std::endl;
    }
    
    std::string getName() const { return name; }
    int getAge() const { return age; }
    double getGrade() const { return grade; }
}`
    ],
    main: `${className} student1("Alice Johnson", 20, 85.5);
    ${className} student2("Bob Smith", 19, 92.0);
    
    std::cout << "Student Records:" << std::endl;
    std::cout << "===============" << std::endl;
    
    student1.display();
    student2.display();`
  };
};

const generateFileTemplate = (style: CppStyle): CppTemplate => {
  return {
    includes: ['<iostream>', '<fstream>', '<string>'],
    functions: [],
    main: `std::ofstream outFile("example.txt");
    if(outFile.is_open()) {
        outFile << "Hello, World!" << std::endl;
        outFile << "This is a sample file." << std::endl;
        outFile.close();
        std::cout << "File written successfully." << std::endl;
    }
    
    std::ifstream inFile("example.txt");
    std::string line;
    
    if(inFile.is_open()) {
        std::cout << "File contents:" << std::endl;
        while(std::getline(inFile, line)) {
            std::cout << line << std::endl;
        }
        inFile.close();
    } else {
        std::cout << "Unable to open file." << std::endl;
    }`
  };
};

const generateAlgorithmTemplate = (style: CppStyle): CppTemplate => {
  const funcName = style.naming === 'snake_case' ? 'bubble_sort' : 
                   style.naming === 'PascalCase' ? 'BubbleSort' : 'bubbleSort';
  
  return {
    includes: ['<iostream>', '<vector>'],
    functions: [
      `void ${funcName}(std::vector<int>& arr) {
    int n = arr.size();
    for(int i = 0; i < n-1; i++) {
        for(int j = 0; j < n-i-1; j++) {
            if(arr[j] > arr[j+1]) {
                std::swap(arr[j], arr[j+1]);
            }
        }
    }
}`
    ],
    main: `std::vector<int> data = {64, 34, 25, 12, 22, 11, 90};
    
    std::cout << "Original array: ";
    for(int num : data) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    ${funcName}(data);
    
    std::cout << "Sorted array: ";
    for(int num : data) {
        std::cout << num << " ";
    }
    std::cout << std::endl;`
  };
};

const generateBasicTemplate = (style: CppStyle): CppTemplate => {
  return {
    includes: ['<iostream>'],
    functions: [],
    main: `std::cout << "Hello, World!" << std::endl;
    std::cout << "This is a basic C++ program." << std::endl;
    
    // Add your custom logic here based on: "${style.includeComments ? 'User prompt' : ''}"
    
    return 0;`
  };
};

const formatCode = (template: CppTemplate, style: CppStyle): string => {
  const indent = getIndentation(style);
  let code = '';
  
  // Add includes
  template.includes.forEach(include => {
    code += `#include ${include}\n`;
  });
  
  if (template.includes.length > 0) {
    code += '\n';
  }
  
  // Add using namespace
  code += 'using namespace std;\n\n';
  
  // Add functions
  template.functions.forEach(func => {
    code += formatFunction(func, style) + '\n\n';
  });
  
  // Add main function
  code += formatMainFunction(template.main, style);
  
  return code;
};

const formatFunction = (func: string, style: CppStyle): string => {
  const indent = getIndentation(style);
  const lines = func.split('\n');
  let formatted = '';
  let indentLevel = 0;
  
  lines.forEach(line => {
    const trimmed = line.trim();
    
    if (trimmed.includes('}')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    if (trimmed) {
      formatted += indent.repeat(indentLevel) + trimmed + '\n';
    } else {
      formatted += '\n';
    }
    
    if (trimmed.includes('{')) {
      indentLevel++;
    }
  });
  
  return formatted.trim();
};

const formatMainFunction = (mainBody: string, style: CppStyle): string => {
  const indent = getIndentation(style);
  const openBrace = style.braceStyle === 'Allman' ? '\n{' : ' {';
  
  let formatted = `int main()${openBrace}\n`;
  
  const lines = mainBody.split('\n');
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed) {
      formatted += indent + trimmed + '\n';
    } else {
      formatted += '\n';
    }
  });
  
  formatted += '}\n';
  
  return formatted;
};

const getIndentation = (style: CppStyle): string => {
  switch (style.indentation) {
    case '2spaces':
      return '  ';
    case '4spaces':
      return '    ';
    case 'tabs':
      return '\t';
    default:
      return '    ';
  }
};