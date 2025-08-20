import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, History, BookOpen, Zap } from 'lucide-react';
import { evaluate, format } from 'mathjs';
import { analyticsService } from '../../services/analytics';
import { useAuthStore } from '../../store/auth';
import toast from 'react-hot-toast';

interface CalculationHistory {
  expression: string;
  result: string;
  timestamp: Date;
}

export function EngineeringCalculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [mode, setMode] = useState<'basic' | 'scientific' | 'programming'>('scientific');
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg');
  const [memory, setMemory] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem('calculator-history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory).map((h: any) => ({
        ...h,
        timestamp: new Date(h.timestamp)
      })));
    }
  }, []);

  useEffect(() => {
    // Save history to localStorage
    localStorage.setItem('calculator-history', JSON.stringify(history));
  }, [history]);

  const addToHistory = (expr: string, result: string) => {
    const newEntry: CalculationHistory = {
      expression: expr,
      result,
      timestamp: new Date()
    };
    setHistory(prev => [newEntry, ...prev.slice(0, 49)]); // Keep last 50 calculations
  };

  const handleNumber = (num: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(num);
      setExpression(num);
    } else {
      setDisplay(display + num);
      setExpression(expression + num);
    }
  };

  const handleOperator = (op: string) => {
    if (display === 'Error') return;
    
    let operator = op;
    if (op === '×') operator = '*';
    if (op === '÷') operator = '/';
    
    setExpression(expression + operator);
    setDisplay(display + op);
  };

  const handleFunction = (func: string) => {
    if (display === 'Error') return;
    
    try {
      let value = parseFloat(display);
      let result: number;
      
      switch (func) {
        case 'sin':
          result = angleMode === 'deg' ? Math.sin(value * Math.PI / 180) : Math.sin(value);
          break;
        case 'cos':
          result = angleMode === 'deg' ? Math.cos(value * Math.PI / 180) : Math.cos(value);
          break;
        case 'tan':
          result = angleMode === 'deg' ? Math.tan(value * Math.PI / 180) : Math.tan(value);
          break;
        case 'sinh':
          result = Math.sinh(value);
          break;
        case 'cosh':
          result = Math.cosh(value);
          break;
        case 'tanh':
          result = Math.tanh(value);
          break;
        case 'sin⁻¹':
          result = angleMode === 'deg' ? Math.asin(value) * 180 / Math.PI : Math.asin(value);
          break;
        case 'cos⁻¹':
          result = angleMode === 'deg' ? Math.acos(value) * 180 / Math.PI : Math.acos(value);
          break;
        case 'tan⁻¹':
          result = angleMode === 'deg' ? Math.atan(value) * 180 / Math.PI : Math.atan(value);
          break;
        case 'sinh⁻¹':
          result = Math.asinh(value);
          break;
        case 'cosh⁻¹':
          result = Math.acosh(value);
          break;
        case 'tanh⁻¹':
          result = Math.atanh(value);
          break;
        case 'log':
          result = Math.log10(value);
          break;
        case 'ln':
          result = Math.log(value);
          break;
        case '√':
          result = Math.sqrt(value);
          break;
        case 'x²':
          result = value * value;
          break;
        case 'x³':
          result = value * value * value;
          break;
        case '1/x':
          result = 1 / value;
          break;
        case 'e^x':
          result = Math.exp(value);
          break;
        case '10^x':
          result = Math.pow(10, value);
          break;
        case 'x!':
          result = factorial(value);
          break;
        case '|x|':
          result = Math.abs(value);
          break;
        default:
          return;
      }
      
      const formattedResult = formatResult(result);
      setDisplay(formattedResult);
      setExpression(formattedResult);
      addToHistory(`${func}(${value})`, formattedResult);
      
    } catch (error) {
      setDisplay('Error');
      setExpression('');
    }
  };

  const handleConstant = (constant: string) => {
    let value: number;
    switch (constant) {
      case 'π':
        value = Math.PI;
        break;
      case 'e':
        value = Math.E;
        break;
      case 'φ': // Golden ratio
        value = (1 + Math.sqrt(5)) / 2;
        break;
      default:
        return;
    }
    
    const formattedValue = formatResult(value);
    setDisplay(formattedValue);
    setExpression(formattedValue);
  };

  const calculate = () => {
    if (!expression || display === 'Error') return;
    
    try {
      // Replace display operators with math operators
      let mathExpression = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, Math.PI.toString())
        .replace(/e/g, Math.E.toString());
      
      const result = evaluate(mathExpression);
      const formattedResult = formatResult(result);
      
      setDisplay(formattedResult);
      setExpression(formattedResult);
      addToHistory(expression, formattedResult);
      
      // Log tool usage
      if (user) {
        analyticsService.logToolUsage(
          user.id,
          'Engineering Calculator',
          'Engineering',
          1,
          { expression, result: formattedResult }
        );
      }
      
    } catch (error) {
      setDisplay('Error');
      setExpression('');
      toast.error('Invalid expression');
    }
  };

  const clear = () => {
    setDisplay('0');
    setExpression('');
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const backspace = () => {
    if (display.length > 1 && display !== 'Error') {
      const newDisplay = display.slice(0, -1);
      const newExpression = expression.slice(0, -1);
      setDisplay(newDisplay || '0');
      setExpression(newExpression);
    } else {
      setDisplay('0');
      setExpression('');
    }
  };

  const formatResult = (result: number): string => {
    if (isNaN(result) || !isFinite(result)) return 'Error';
    
    // Handle very large or very small numbers
    if (Math.abs(result) > 1e15 || (Math.abs(result) < 1e-10 && result !== 0)) {
      return result.toExponential(10);
    }
    
    // Round to avoid floating point precision issues
    const rounded = Math.round(result * 1e12) / 1e12;
    return rounded.toString();
  };

  const factorial = (n: number): number => {
    if (n < 0 || n !== Math.floor(n)) throw new Error('Invalid input');
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const memoryStore = () => {
    try {
      setMemory(parseFloat(display));
      toast.success('Value stored in memory');
    } catch (error) {
      toast.error('Invalid value');
    }
  };

  const memoryRecall = () => {
    setDisplay(memory.toString());
    setExpression(memory.toString());
  };

  const memoryClear = () => {
    setMemory(0);
    toast.success('Memory cleared');
  };

  const memoryAdd = () => {
    try {
      setMemory(memory + parseFloat(display));
      toast.success('Value added to memory');
    } catch (error) {
      toast.error('Invalid value');
    }
  };

  const memorySubtract = () => {
    try {
      setMemory(memory - parseFloat(display));
      toast.success('Value subtracted from memory');
    } catch (error) {
      toast.error('Invalid value');
    }
  };

  const scientificButtons = [
    // Row 1
    [
      { label: 'sin', action: () => handleFunction('sin'), type: 'function' },
      { label: 'cos', action: () => handleFunction('cos'), type: 'function' },
      { label: 'tan', action: () => handleFunction('tan'), type: 'function' },
      { label: 'sinh', action: () => handleFunction('sinh'), type: 'function' },
    ],
    // Row 2
    [
      { label: 'sin⁻¹', action: () => handleFunction('sin⁻¹'), type: 'function' },
      { label: 'cos⁻¹', action: () => handleFunction('cos⁻¹'), type: 'function' },
      { label: 'tan⁻¹', action: () => handleFunction('tan⁻¹'), type: 'function' },
      { label: 'tanh', action: () => handleFunction('tanh'), type: 'function' },
    ],
    // Row 3
    [
      { label: 'log', action: () => handleFunction('log'), type: 'function' },
      { label: 'ln', action: () => handleFunction('ln'), type: 'function' },
      { label: 'e^x', action: () => handleFunction('e^x'), type: 'function' },
      { label: '10^x', action: () => handleFunction('10^x'), type: 'function' },
    ],
    // Row 4
    [
      { label: '√', action: () => handleFunction('√'), type: 'function' },
      { label: 'x²', action: () => handleFunction('x²'), type: 'function' },
      { label: 'x³', action: () => handleFunction('x³'), type: 'function' },
      { label: '1/x', action: () => handleFunction('1/x'), type: 'function' },
    ],
    // Row 5
    [
      { label: 'π', action: () => handleConstant('π'), type: 'constant' },
      { label: 'e', action: () => handleConstant('e'), type: 'constant' },
      { label: 'x!', action: () => handleFunction('x!'), type: 'function' },
      { label: '|x|', action: () => handleFunction('|x|'), type: 'function' },
    ],
  ];

  const basicButtons = [
    // Row 1
    [
      { label: 'MC', action: memoryClear, type: 'memory' },
      { label: 'MR', action: memoryRecall, type: 'memory' },
      { label: 'M+', action: memoryAdd, type: 'memory' },
      { label: 'M-', action: memorySubtract, type: 'memory' },
    ],
    // Row 2
    [
      { label: 'C', action: clear, type: 'clear' },
      { label: 'CE', action: clearEntry, type: 'clear' },
      { label: '⌫', action: backspace, type: 'clear' },
      { label: '÷', action: () => handleOperator('÷'), type: 'operator' },
    ],
    // Row 3
    [
      { label: '7', action: () => handleNumber('7'), type: 'number' },
      { label: '8', action: () => handleNumber('8'), type: 'number' },
      { label: '9', action: () => handleNumber('9'), type: 'number' },
      { label: '×', action: () => handleOperator('×'), type: 'operator' },
    ],
    // Row 4
    [
      { label: '4', action: () => handleNumber('4'), type: 'number' },
      { label: '5', action: () => handleNumber('5'), type: 'number' },
      { label: '6', action: () => handleNumber('6'), type: 'number' },
      { label: '-', action: () => handleOperator('-'), type: 'operator' },
    ],
    // Row 5
    [
      { label: '1', action: () => handleNumber('1'), type: 'number' },
      { label: '2', action: () => handleNumber('2'), type: 'number' },
      { label: '3', action: () => handleNumber('3'), type: 'number' },
      { label: '+', action: () => handleOperator('+'), type: 'operator' },
    ],
    // Row 6
    [
      { label: '±', action: () => setDisplay((parseFloat(display) * -1).toString()), type: 'function' },
      { label: '0', action: () => handleNumber('0'), type: 'number' },
      { label: '.', action: () => handleNumber('.'), type: 'number' },
      { label: '=', action: calculate, type: 'equals' },
    ],
  ];

  const getButtonStyle = (type: string) => {
    const baseStyle = "h-12 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95";
    
    switch (type) {
      case 'number':
        return `${baseStyle} bg-gray-700 hover:bg-gray-600 text-white`;
      case 'operator':
        return `${baseStyle} bg-blue-600 hover:bg-blue-700 text-white`;
      case 'function':
        return `${baseStyle} bg-purple-600 hover:bg-purple-700 text-white`;
      case 'constant':
        return `${baseStyle} bg-green-600 hover:bg-green-700 text-white`;
      case 'memory':
        return `${baseStyle} bg-orange-600 hover:bg-orange-700 text-white`;
      case 'clear':
        return `${baseStyle} bg-red-600 hover:bg-red-700 text-white`;
      case 'equals':
        return `${baseStyle} bg-green-600 hover:bg-green-700 text-white`;
      default:
        return `${baseStyle} bg-gray-600 hover:bg-gray-700 text-white`;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-900 rounded-2xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Calculator className="text-blue-400 mr-3" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-white">Engineering Calculator</h2>
            <p className="text-gray-400">Advanced scientific calculations</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Mode Selector */}
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
            className="px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-400 focus:outline-none"
          >
            <option value="basic">Basic</option>
            <option value="scientific">Scientific</option>
            <option value="programming">Programming</option>
          </select>
          
          {/* Angle Mode */}
          <button
            onClick={() => setAngleMode(angleMode === 'deg' ? 'rad' : 'deg')}
            className={`px-3 py-2 rounded-lg font-medium transition-colors ${
              angleMode === 'deg' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {angleMode.toUpperCase()}
          </button>
          
          {/* History Toggle */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
          >
            <History size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calculator */}
        <div className="lg:col-span-3">
          {/* Display */}
          <div className="bg-black rounded-lg p-6 mb-6">
            <div className="text-right">
              <div className="text-gray-400 text-sm mb-2 h-6">
                {expression && expression !== display ? expression : ''}
              </div>
              <div className="text-white text-4xl font-mono break-all">
                {display}
              </div>
            </div>
          </div>

          {/* Scientific Functions */}
          {mode === 'scientific' && (
            <div className="mb-6">
              <h3 className="text-white text-lg font-semibold mb-3 flex items-center">
                <Zap className="mr-2" size={20} />
                Scientific Functions
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {scientificButtons.flat().map((button, index) => (
                  <button
                    key={index}
                    onClick={button.action}
                    className={getButtonStyle(button.type)}
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Basic Calculator */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-3 flex items-center">
              <Calculator className="mr-2" size={20} />
              Basic Operations
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {basicButtons.flat().map((button, index) => (
                <button
                  key={index}
                  onClick={button.action}
                  className={getButtonStyle(button.type)}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* History Panel */}
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center">
                <History className="mr-2" size={18} />
                History
              </h3>
              <button
                onClick={() => {
                  setHistory([]);
                  localStorage.removeItem('calculator-history');
                }}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Clear
              </button>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-gray-400 text-sm">No calculations yet</p>
              ) : (
                history.map((calc, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 rounded p-3 cursor-pointer hover:bg-gray-600 transition-colors"
                    onClick={() => {
                      setDisplay(calc.result);
                      setExpression(calc.result);
                    }}
                  >
                    <div className="text-gray-300 text-sm">{calc.expression}</div>
                    <div className="text-white font-mono">{calc.result}</div>
                    <div className="text-gray-500 text-xs">
                      {calc.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick Reference */}
      <div className="mt-6 bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-3 flex items-center">
          <BookOpen className="mr-2" size={18} />
          Quick Reference
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="text-blue-400 font-medium mb-2">Trigonometric</h4>
            <ul className="text-gray-300 space-y-1">
              <li>sin, cos, tan - Basic trig functions</li>
              <li>sin⁻¹, cos⁻¹, tan⁻¹ - Inverse trig</li>
              <li>sinh, cosh, tanh - Hyperbolic</li>
            </ul>
          </div>
          <div>
            <h4 className="text-green-400 font-medium mb-2">Logarithmic</h4>
            <ul className="text-gray-300 space-y-1">
              <li>log - Base 10 logarithm</li>
              <li>ln - Natural logarithm</li>
              <li>e^x - Exponential function</li>
            </ul>
          </div>
          <div>
            <h4 className="text-purple-400 font-medium mb-2">Constants</h4>
            <ul className="text-gray-300 space-y-1">
              <li>π - Pi (3.14159...)</li>
              <li>e - Euler's number (2.71828...)</li>
              <li>Memory functions (MC, MR, M+, M-)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}