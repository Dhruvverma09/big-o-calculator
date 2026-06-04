import ast
import re
from typing import Dict, List

class ComplexityDetector(ast.NodeVisitor):
    """AST visitor to detect loops and complexity patterns"""
    
    def __init__(self):
        self.loops = []
        self.nesting_level = 0
        self.complexity = 'O(1)'
    
    def visit_For(self, node):
        self.nesting_level += 1
        self.loops.append({
            'type': 'for',
            'line': node.lineno,
            'level': self.nesting_level
        })
        self.generic_visit(node)
        self.nesting_level -= 1
    
    def visit_While(self, node):
        self.nesting_level += 1
        self.loops.append({
            'type': 'while',
            'line': node.lineno,
            'level': self.nesting_level
        })
        self.generic_visit(node)
        self.nesting_level -= 1

def detect_complexity_patterns(code: str, language: str) -> Dict:
    """
    Parse code and detect complexity patterns
    """
    if language == 'python':
        return detect_python_complexity(code)
    elif language == 'javascript':
        return detect_javascript_complexity(code)
    else:
        return {'complexity': 'O(n)', 'lines': []}

def detect_python_complexity(code: str) -> Dict:
    """Detect complexity in Python code"""
    try:
        tree = ast.parse(code)
        detector = ComplexityDetector()
        detector.visit(tree)
        
        # Determine complexity based on nesting
        max_nesting = max([loop['level'] for loop in detector.loops], default=0)
        
        if max_nesting == 0:
            complexity = 'O(1)'
        elif max_nesting == 1:
            complexity = 'O(n)'
        elif max_nesting == 2:
            complexity = 'O(n²)'
        elif max_nesting == 3:
            complexity = 'O(n³)'
        else:
            complexity = f'O(n^{max_nesting})'
        
        lines = [loop['line'] for loop in detector.loops]
        
        return {
            'complexity': complexity,
            'lines': lines,
            'loops_detected': len(detector.loops)
        }
    
    except SyntaxError:
        return {'complexity': 'O(n)', 'lines': [], 'error': 'Syntax error in Python code'}

def detect_javascript_complexity(code: str) -> Dict:
    """Detect complexity in JavaScript code using regex patterns"""
    lines = code.split('\n')
    loop_lines = []
    max_nesting = 0
    current_nesting = 0
    
    for i, line in enumerate(lines, 1):
        # Count open braces for nesting
        current_nesting += line.count('{') - line.count('}')
        
        # Check for loops
        if re.search(r'\bfor\s*\(|while\s*\(|do\s*{', line):
            loop_lines.append(i)
            max_nesting = max(max_nesting, current_nesting)
    
    if max_nesting == 0:
        complexity = 'O(1)'
    elif max_nesting == 1:
        complexity = 'O(n)'
    elif max_nesting == 2:
        complexity = 'O(n²)'
    else:
        complexity = f'O(n^{max_nesting})'
    
    return {
        'complexity': complexity,
        'lines': loop_lines,
        'loops_detected': len(loop_lines)
    }