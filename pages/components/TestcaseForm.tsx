"use client";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

// Get API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Types for API responses
interface UseCaseTableRequest {
  useCaseName: string;
  additionalContext?: string;
}

export default function TestcaseForm() {
  const { register, handleSubmit } = useForm({
    defaultValues: { 
      useCaseName: "",
      additionalContext: ""
    },
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isGeneratingUseCase, setIsGeneratingUseCase] = useState(false);


  // Generate use case report with retry mechanism
 // Generate use case report with retry mechanism
const generateUseCaseReport = async (data: any) => {
  try {
    setError("");
    setSuccess("");
    setIsGeneratingUseCase(true);
    
    if (!data.useCaseName.trim()) {
      setError("Use Case Name is required");
      setIsGeneratingUseCase(false);
      return;
    }

    const useCaseRequest: UseCaseTableRequest = {
      useCaseName: data.useCaseName,
      additionalContext: data.additionalContext || undefined
    };
    
    console.log("Sending request to:", "/api/generate-use-case-report");
    console.log("Request data:", useCaseRequest);
    
    // Retry mechanism for Gemini API overload
    let retryCount = 0;
    const maxRetries = 3;
    let lastError = null;
    
    while (retryCount < maxRetries) {
      try {
        const res = await axios.post("/api/generate-use-case-report", useCaseRequest, {
          headers: { "Content-Type": "application/json" },
          responseType: "blob",
          timeout: 90000, // Longer timeout for AI generation
        });

        console.log("Response received:", res.status, res.statusText);

        // Download the Excel file directly
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `usecase_report_${data.useCaseName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        setSuccess(`📊 Use Case Report generated and downloaded successfully!`);
        return; // Success, exit retry loop
        
      } catch (err: any) {
        lastError = err;
        console.error(`Attempt ${retryCount + 1} failed:`, err.response?.data);

        const errorMessage = err.response?.data?.message || err.message || "";
        const isGeminiOverload =
          errorMessage.includes("overloaded") ||
          errorMessage.includes("503") ||
          errorMessage.includes("UNAVAILABLE") ||
          errorMessage.includes("ServiceUnavailable");

        if (isGeminiOverload && retryCount < maxRetries - 1) {
          retryCount++;
          const waitTime = Math.pow(2, retryCount) * 1000; // 2s, 4s, 8s
          console.log(`Gemini API overloaded. Retrying in ${waitTime / 1000}s...`);
          setError(`🤖 AI service busy. Retrying in ${waitTime / 1000}s... (Attempt ${retryCount + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        } else {
          break; // not retryable or max retries reached
        }
      }
    }

    // All retries failed
    console.error("All retry attempts failed. Last error:", lastError);

    // Final error message
    let errorMessage = "Failed to generate use case report";
    if (lastError?.response?.data) {
      try {
        if (lastError.response.data instanceof Blob) {
          const text = await lastError.response.data.text();
          errorMessage = text || errorMessage;
        } else {
          errorMessage = lastError.response.data.message || lastError.response.data || errorMessage;
        }
      } catch (parseError) {
        console.error("Error parsing error response:", parseError);
      }
    }

    // Friendly error display
    if (errorMessage.includes("overloaded") || errorMessage.includes("503") || errorMessage.includes("UNAVAILABLE")) {
      setError("🤖 AI service is currently overloaded. Please try again later.");
    } else if (errorMessage.includes("JSON value could not be converted")) {
      setError("⚠️ Backend model mismatch. Please contact the development team.");
    } else {
      setError(errorMessage);
    }

  } finally {
    setIsGeneratingUseCase(false);
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Use Case Report Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate comprehensive use case reports with AI assistance and export to professional Excel documents
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-lg animate-fadeIn">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-800">Error</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-lg animate-fadeIn">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-green-800">Success</h3>
                <p className="text-green-700 mt-1">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Header for Use Case Report */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-center">
            <div className="bg-green-100 p-4 rounded-xl mr-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800">Use Case Report Generator</h2>
              <p className="text-lg text-gray-600 mt-2">Generate comprehensive use case reports with AI assistance</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(generateUseCaseReport)} className="space-y-8">
          {/* Use Case Report Form */}
            <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-3 rounded-xl mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Use Case Report Generation</h2>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Use Case Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    placeholder="e.g., User Login, Payment Processing, Data Validation" 
                    {...register("useCaseName")} 
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 shadow-sm hover:shadow-md" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Additional Context (Optional)</label>
                  <textarea 
                    placeholder="Provide additional context, requirements, or specifications for the use case. This will help AI generate a more comprehensive and accurate report." 
                    {...register("additionalContext")} 
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 shadow-sm hover:shadow-md resize-none" 
                  />
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">📊 Use Case Report Features</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <ul className="list-disc list-inside space-y-1">
                          <li>AI-generated comprehensive use case analysis</li>
                          <li>Professional Excel report with detailed documentation</li>
                          <li>Includes use case scenarios, actors, and requirements</li>
                          <li>Automatically formatted and ready for stakeholder review</li>
                          <li>Perfect for project documentation and requirements gathering</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">⏱️ Processing Time</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>AI generation may take 30-90 seconds depending on service load. The system will automatically retry if the AI service is busy.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">⚠️ Known Issue</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>If you encounter a "Backend model mismatch" error, this indicates the AI is generating correct data but the backend model needs updating. The development team is aware of this issue.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          {/* Submit Button */}
          <div className="space-y-4">
            <button
              type="submit"
              disabled={isGeneratingUseCase}
              className="w-full px-8 py-5 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white font-bold text-xl rounded-2xl hover:from-green-700 hover:via-emerald-700 hover:to-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-offset-2 transition-all duration-300 shadow-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              {isGeneratingUseCase ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Use Case Report...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate Use Case Report
                </span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
