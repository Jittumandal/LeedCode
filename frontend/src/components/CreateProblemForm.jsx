import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Title,
  Group,
  Button,
  TextInput,
  Textarea,
  Select,
  Box,
  Text,
} from "@mantine/core";

const problemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  constraints: z.string().min(1, "Constraints are required"),
  hints: z.string().optional(),
  editorial: z.string().optional(),
  testcases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      })
    )
    .min(1, "At least one test case is required"),
  examples: z.object({
    JAVASCRIPT: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    PYTHON: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    JAVA: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
  }),
  codeSnippets: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript code snippet is required"),
    PYTHON: z.string().min(1, "Python code snippet is required"),
    JAVA: z.string().min(1, "Java solution is required"),
  }),
  referenceSolutions: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript solution is required"),
    PYTHON: z.string().min(1, "Python solution is required"),
    JAVA: z.string().min(1, "Java solution is required"),
  }),
});

const sampledpData = {
  title: "Climbing Stairs",
  category: "dp", // Dynamic Programming
  description:
    "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
  difficulty: "EASY",
  tags: ["Dynamic Programming", "Math", "Memoization"],
  constraints: "1 <= n <= 45",
  hints:
    "To reach the nth step, you can either come from the (n-1)th step or the (n-2)th step.",
  editorial:
    "This is a classic dynamic programming problem. The number of ways to reach the nth step is the sum of the number of ways to reach the (n-1)th step and the (n-2)th step, forming a Fibonacci-like sequence.",
  testcases: [
    {
      input: "2",
      output: "2",
    },
    {
      input: "3",
      output: "3",
    },
    {
      input: "4",
      output: "5",
    },
  ],
  examples: {
    JAVASCRIPT: {
      input: "n = 2",
      output: "2",
      explanation:
        "There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps",
    },
    PYTHON: {
      input: "n = 3",
      output: "3",
      explanation:
        "There are three ways to climb to the top:\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step",
    },
    JAVA: {
      input: "n = 4",
      output: "5",
      explanation:
        "There are five ways to climb to the top:\n1. 1 step + 1 step + 1 step + 1 step\n2. 1 step + 1 step + 2 steps\n3. 1 step + 2 steps + 1 step\n4. 2 steps + 1 step + 1 step\n5. 2 steps + 2 steps",
    },
  },
  codeSnippets: {
    JAVASCRIPT: `/**
* @param {number} n
* @return {number}
*/
function climbStairs(n) {
// Write your code here
}

// Parse input and execute
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: false
});

rl.on('line', (line) => {
const n = parseInt(line.trim());
const result = climbStairs(n);

console.log(result);
rl.close();
});`,
    PYTHON: `class Solution:
  def climbStairs(self, n: int) -> int:
      # Write your code here
      pass

# Input parsing
if __name__ == "__main__":
  import sys
  
  # Parse input
  n = int(sys.stdin.readline().strip())
  
  # Solve
  sol = Solution()
  result = sol.climbStairs(n)
  
  # Print result
  print(result)`,
    JAVA: `import java.util.Scanner;

class Main {
  public int climbStairs(int n) {
      // Write your code here
      return 0;
  }
  
  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      int n = Integer.parseInt(scanner.nextLine().trim());
      
      // Use Main class instead of Solution
      Main main = new Main();
      int result = main.climbStairs(n);
      
      System.out.println(result);
      scanner.close();
  }
}`,
  },
  referenceSolutions: {
    JAVASCRIPT: `/**
* @param {number} n
* @return {number}
*/
function climbStairs(n) {
// Base cases
if (n <= 2) {
  return n;
}

// Dynamic programming approach
let dp = new Array(n + 1);
dp[1] = 1;
dp[2] = 2;

for (let i = 3; i <= n; i++) {
  dp[i] = dp[i - 1] + dp[i - 2];
}

return dp[n];

/* Alternative approach with O(1) space
let a = 1; // ways to climb 1 step
let b = 2; // ways to climb 2 steps

for (let i = 3; i <= n; i++) {
  let temp = a + b;
  a = b;
  b = temp;
}

return n === 1 ? a : b;
*/
}

// Parse input and execute
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: false
});

rl.on('line', (line) => {
const n = parseInt(line.trim());
const result = climbStairs(n);

console.log(result);
rl.close();
});`,
    PYTHON: `class Solution:
  def climbStairs(self, n: int) -> int:
      # Base cases
      if n <= 2:
          return n
      
      # Dynamic programming approach
      dp = [0] * (n + 1)
      dp[1] = 1
      dp[2] = 2
      
      for i in range(3, n + 1):
          dp[i] = dp[i - 1] + dp[i - 2]
      
      return dp[n]
      
      # Alternative approach with O(1) space
      # a, b = 1, 2
      # 
      # for i in range(3, n + 1):
      #     a, b = b, a + b
      # 
      # return a if n == 1 else b

# Input parsing
if __name__ == "__main__":
  import sys
  
  # Parse input
  n = int(sys.stdin.readline().strip())
  
  # Solve
  sol = Solution()
  result = sol.climbStairs(n)
  
  # Print result
  print(result)`,
    JAVA: `import java.util.Scanner;

class Main {
  public int climbStairs(int n) {
      // Base cases
      if (n <= 2) {
          return n;
      }
      
      // Dynamic programming approach
      int[] dp = new int[n + 1];
      dp[1] = 1;
      dp[2] = 2;
      
      for (int i = 3; i <= n; i++) {
          dp[i] = dp[i - 1] + dp[i - 2];
      }
      
      return dp[n];
      
      /* Alternative approach with O(1) space
      int a = 1; // ways to climb 1 step
      int b = 2; // ways to climb 2 steps
      
      for (int i = 3; i <= n; i++) {
          int temp = a + b;
          a = b;
          b = temp;
      }
      
      return n == 1 ? a : b;
      */
  }
  
  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      int n = Integer.parseInt(scanner.nextLine().trim());
      
      // Use Main class instead of Solution
      Main main = new Main();
      int result = main.climbStairs(n);
      
      System.out.println(result);
      scanner.close();
  }
}`,
  },
};

// Sample problem data for another type of question
const sampleStringProblem = {
  title: "Valid Palindrome",
  description:
    "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string s, return true if it is a palindrome, or false otherwise.",
  difficulty: "EASY",
  tags: ["String", "Two Pointers"],
  constraints:
    "1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.",
  hints:
    "Consider using two pointers, one from the start and one from the end, moving towards the center.",
  editorial:
    "We can use two pointers approach to check if the string is a palindrome. One pointer starts from the beginning and the other from the end, moving towards each other.",
  testcases: [
    {
      input: "A man, a plan, a canal: Panama",
      output: "true",
    },
    {
      input: "race a car",
      output: "false",
    },
    {
      input: " ",
      output: "true",
    },
  ],
  examples: {
    JAVASCRIPT: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
    PYTHON: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
    JAVA: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
  },
  codeSnippets: {
    JAVASCRIPT: `/**
   * @param {string} s
   * @return {boolean}
   */
  function isPalindrome(s) {
    // Write your code here
  }
  
  // Add readline for dynamic input handling
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  
  // Process input line
  rl.on('line', (line) => {
    // Call solution with the input string
    const result = isPalindrome(line);
    
    // Output the result
    console.log(result ? "true" : "false");
    rl.close();
  });`,
    PYTHON: `class Solution:
      def isPalindrome(self, s: str) -> bool:
          # Write your code here
          pass
  
  # Input parsing
  if __name__ == "__main__":
      import sys
      # Read the input string
      s = sys.stdin.readline().strip()
      
      # Call solution
      sol = Solution()
      result = sol.isPalindrome(s)
      
      # Output result
      print(str(result).lower())  # Convert True/False to lowercase true/false`,
    JAVA: `import java.util.Scanner;

public class Main {
    public static String preprocess(String s) {
        return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }

    public static boolean isPalindrome(String s) {
       
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();

        boolean result = isPalindrome(input);
        System.out.println(result ? "true" : "false");
    }
}
`,
  },
  referenceSolutions: {
    JAVASCRIPT: `/**
   * @param {string} s
   * @return {boolean}
   */
  function isPalindrome(s) {
    // Convert to lowercase and remove non-alphanumeric characters
    s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Check if it's a palindrome
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
      if (s[left] !== s[right]) {
        return false;
      }
      left++;
      right--;
    }
    
    return true;
  }
  
  // Add readline for dynamic input handling
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  
  // Process input line
  rl.on('line', (line) => {
    // Call solution with the input string
    const result = isPalindrome(line);
    
    // Output the result
    console.log(result ? "true" : "false");
    rl.close();
  });`,
    PYTHON: `class Solution:
      def isPalindrome(self, s: str) -> bool:
          # Convert to lowercase and keep only alphanumeric characters
          filtered_chars = [c.lower() for c in s if c.isalnum()]
          
          # Check if it's a palindrome
          return filtered_chars == filtered_chars[::-1]
  
  # Input parsing
  if __name__ == "__main__":
      import sys
      # Read the input string
      s = sys.stdin.readline().strip()
      
      # Call solution
      sol = Solution()
      result = sol.isPalindrome(s)
      
      # Output result
      print(str(result).lower())  # Convert True/False to lowercase true/false`,
    JAVA: `import java.util.Scanner;

public class Main {
    public static String preprocess(String s) {
        return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }

    public static boolean isPalindrome(String s) {
        s = preprocess(s);
        int left = 0, right = s.length() - 1;

        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) return false;
            left++;
            right--;
        }

        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();

        boolean result = isPalindrome(input);
        System.out.println(result ? "true" : "false");
    }
}
`,
  },
};

const CreateProblemForm = () => {
  const [sampleType, setSampleType] = useState("DP");
  const navigation = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      testcases: [{ input: "", output: "" }],
      tags: [""],
      examples: {
        JAVASCRIPT: { input: "", output: "", explanation: "" },
        PYTHON: { input: "", output: "", explanation: "" },
        JAVA: { input: "", output: "", explanation: "" },
      },
      codeSnippets: {
        JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
        PYTHON: "def solution():\n    # Write your code here\n    pass",
        JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
      },
      referenceSolutions: {
        JAVASCRIPT: "// Add your reference solution here",
        PYTHON: "# Add your reference solution here",
        JAVA: "// Add your reference solution here",
      },
    },
  });

  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
    replace: replacetestcases,
  } = useFieldArray({
    control,
    name: "testcases",
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
    replace: replaceTags,
  } = useFieldArray({
    control,
    name: "tags",
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (value) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.post("/problems/create-problem", value);
      console.log(res.data);
      toast.success(res.data.message || "Problem Created successfully⚡");
      navigation("/");
    } catch (error) {
      console.log(error);
      toast.error("Error creating problem");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleData = () => {
    const sampleData = sampleType === "DP" ? sampledpData : sampleStringProblem;
    replaceTags(sampleData.tags.map((tag) => tag));
    replacetestcases(sampleData.testcases.map((tc) => tc));
    // Reset the form with sample data
    reset(sampleData);
  };

  return (
    <Container size="lg">
      <Group mt="lg" justify="center">
        <Title order={1}>Create Problem</Title>
        <Button
          variant="filled"
          className={sampleType === "DP" ? "btn-active" : ""}
          onClick={() => setSampleType("array")}
        >
          DP Problem
        </Button>
        <Button
          variant="filled"
          className={sampleType === "string" ? "btn-active" : ""}
          onClick={() => setSampleType("string")}
        >
          String Problem
        </Button>
        <Button
          variant="filled"
          className="btn-secondary gap-2"
          onClick={loadSampleData}
        >
          Download Sample
        </Button>
      </Group>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Basic Information */}
        <Box p="lg" shadow="sm" radius="md">
          <Title order={2} mb="md">
            Basic Information
          </Title>

          <TextInput
            mb="md"
            size="lg"
            label="Title"
            {...register("title")}
            placeholder="Enter problem title"
          />
          {errors.title && <span>{errors.title.message}</span>}

          <Textarea
            mt="md"
            label="Description"
            {...register("description")}
            placeholder="Enter problem description"
          />
          {errors.description && <span>{errors.description.message}</span>}

          <Select
            mt="md"
            {...register("difficulty")}
            label="Difficulty"
            placeholder="Pick value"
            data={["EASY", "MEDIUM", "HARD"]}
            defaultValue="EASY"
            clearable
          />
          {errors.difficulty && <span>{errors.difficulty.message}</span>}
        </Box>
        {/* tags */}
        <Box p="lg" shadow="md" radius="md">
          <Group mt="lg" justify="space-between">
            <Title order={1}>Tags</Title>
            <Button variant="filled" onClick={() => appendTag("")}>
              ➕ Add Tag
            </Button>
          </Group>

          {tagFields.map((field, index) => (
            <Group key={field.id} mt="md">
              <TextInput
                {...register(`tags.${index}`)}
                placeholder="Enter tag"
              />
              <Button
                variant="filled"
                onClick={() => removeTag(index)}
                disabled={tagFields.length === 1}
              >
                🗑️ Remove Tag
              </Button>
            </Group>
          ))}

          {errors.tags && <span>{errors.tags.message}</span>}
        </Box>

        {/* Test Cases */}
        <Box p="lg" shadow="md" radius="md">
          <Group mt="lg" justify="space-between">
            <Title order={1}>Test Cases</Title>
            <Button
              variant="filled"
              onClick={() => appendTestCase({ input: "", output: "" })}
            >
              ➕ Add Test Case
            </Button>
          </Group>

          {testCaseFields.map((field, index) => (
            <Box key={field.id} p="md" shadow="sm" radius="md" mt="md">
              <Group justify="space-between">
                <Title order={2}>Test Case #{index + 1}</Title>
                <Button
                  variant="filled"
                  onClick={() => removeTestCase(index)}
                  disabled={testCaseFields.length === 1}
                >
                  🗑️ Remove
                </Button>
              </Group>

              <Textarea
                mt="md"
                label="Input"
                {...register(`testcases.${index}.input`)}
                placeholder="Enter test case input"
              />
              {errors.testcases?.[index]?.input && (
                <span>{errors.testcases[index].input.message}</span>
              )}

              <Textarea
                mt="md"
                label="Expected Output"
                {...register(`testcases.${index}.output`)}
                placeholder="Enter expected output"
              />
              {errors.testcases?.[index]?.output && (
                <span>{errors.testcases[index].output.message}</span>
              )}
            </Box>
          ))}

          {errors.testcases && !Array.isArray(errors.testcases) && (
            <span>{errors.testcases.message}</span>
          )}
        </Box>

        {/* Code Editor Sections */}
        <Box p="lg" shadow="md" radius="md">
          {["JAVASCRIPT", "PYTHON", "JAVA"].map((language) => (
            <Box key={language} mt="lg" p="md" shadow="sm" radius="md">
              <Title order={2}>{language}</Title>

              <Box mt="md">
                <Title order={3}>Starter Code Template</Title>
                <Controller
                  name={`codeSnippets.${language}`}
                  control={control}
                  render={({ field }) => (
                    <Editor
                      height="300px"
                      language={language.toLowerCase()}
                      theme="vs-dark"
                      value={field.value}
                      onChange={field.onChange}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: "on",
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                      }}
                    />
                  )}
                />
                {errors.codeSnippets?.[language] && (
                  <span>{errors.codeSnippets[language].message}</span>
                )}
              </Box>

              <Box mt="md">
                <Title order={3}>Reference Solution</Title>
                <Controller
                  name={`referenceSolutions.${language}`}
                  control={control}
                  render={({ field }) => (
                    <Editor
                      height="300px"
                      language={language.toLowerCase()}
                      theme="vs-dark"
                      value={field.value}
                      onChange={field.onChange}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: "on",
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                      }}
                    />
                  )}
                />
                {errors.referenceSolutions?.[language] && (
                  <span>{errors.referenceSolutions[language].message}</span>
                )}
              </Box>

              <Box mt="md">
                <Title order={3}>Example</Title>
                <Textarea
                  label="Input"
                  {...register(`examples.${language}.input`)}
                  placeholder="Example input"
                />
                {errors.examples?.[language]?.input && (
                  <span>{errors.examples[language].input.message}</span>
                )}

                <Textarea
                  label="Output"
                  {...register(`examples.${language}.output`)}
                  placeholder="Example output"
                />
                {errors.examples?.[language]?.output && (
                  <span>{errors.examples[language].output.message}</span>
                )}

                <Textarea
                  label="Explanation"
                  {...register(`examples.${language}.explanation`)}
                  placeholder="Explain the example"
                />
              </Box>
            </Box>
          ))}

          <Box mt="lg" p="md" shadow="sm" radius="md">
            <Title order={2}>Additional Information</Title>
            <Textarea
              label="Constraints"
              {...register("constraints")}
              placeholder="Enter problem constraints"
            />
            {errors.constraints && <span>{errors.constraints.message}</span>}

            <Textarea
              label="Hints (Optional)"
              {...register("hints")}
              placeholder="Enter hints for solving the problem"
            />
            <Textarea
              label="Editorial (Optional)"
              {...register("editorial")}
              placeholder="Enter problem editorial/solution explanation"
            />
          </Box>

          <Box mt="lg" display="flex" justifyContent="flex-end">
            <Button type="submit" variant="filled" size="lg">
              {isLoading ? (
                <span className="loading loading-spinner text-white"></span>
              ) : (
                "Create Problem"
              )}
            </Button>
          </Box>
        </Box>
      </form>
    </Container>
  );
};

export default CreateProblemForm;
