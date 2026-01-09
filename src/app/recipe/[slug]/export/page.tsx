"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import recipesData from "@/lib/data/recipes.json";
import { jsPDF } from "jspdf";
import {
  Clock,
  Users,
  ChefHat,
  Download,
  ArrowLeft,
  Settings,
  Loader2,
  X,
} from "lucide-react";

export default function PrintRecipePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const recipe = recipesData.recipes.find((r) => r.slug === slug);
  const [showImage, setShowImage] = useState(true);
  const [showNutrition, setShowNutrition] = useState(true);
  const [showDetails, setShowDetails] = useState(true);
  const [showIngredients, setShowIngredients] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const handleExportPDF = async () => {
    if (!recipe) return;

    setIsExporting(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      let y = 15;

      const checkNewPage = (neededHeight: number) => {
        if (y + neededHeight > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
      };

      // Header Image with overlay
      let imageLoaded = false;
      if (showImage && recipe.image) {
        try {
          const img = await loadImage(recipe.image);

          // Create canvas with gradient overlay baked in
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (ctx) {
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw original image
            ctx.drawImage(img, 0, 0);

            // Add gradient overlay
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, "rgba(0, 0, 0, 0.1)");
            gradient.addColorStop(0.5, "rgba(0, 0, 0, 0.3)");
            gradient.addColorStop(1, "rgba(0, 0, 0, 0.7)");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          const imgData = canvas.toDataURL("image/jpeg", 0.9);
          const imgWidth = pageWidth;
          const imgHeight = (img.height / img.width) * imgWidth;
          const maxHeight = 90;
          const finalHeight = Math.min(imgHeight, maxHeight);

          // Add image (full width, no margin)
          doc.addImage(imgData, "JPEG", 0, 0, imgWidth, finalHeight);

          // Category badge on image
          doc.setFillColor(236, 72, 153);
          doc.roundedRect(margin, finalHeight - 35, 28, 8, 2, 2, "F");
          doc.setFontSize(8);
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          doc.text(
            recipe.category.toUpperCase(),
            margin + 14,
            finalHeight - 30,
            { align: "center" }
          );

          // Title on image
          doc.setFontSize(18);
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          const titleLines = doc.splitTextToSize(
            recipe.title,
            pageWidth - margin * 1.5
          );
          doc.text(titleLines, margin, finalHeight - 18);
          // Description
          if (showDescription) {
            doc.setFontSize(11);
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "normal");
            const descLines = doc.splitTextToSize(
              recipe.description,
              pageWidth - margin * 3
            );
            doc.text(descLines, margin, finalHeight - 12);
            // y += descLines.length * 5 + 5;
          }
          y = finalHeight + 8;
          imageLoaded = true;
        } catch {
          console.log("Could not load image, continuing without it");
        }
      }

      // If no image, show text-based header
      if (!imageLoaded) {
        doc.setFillColor(236, 72, 153); // primary-500
        doc.roundedRect(margin, y, 30, 7, 2, 2, "F");
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text(recipe.category, margin + 15, y + 5, { align: "center" });
        y += 18;

        // Title
        doc.setFontSize(24);
        doc.setTextColor(17, 24, 39); // gray-900
        doc.setFont("helvetica", "bold");
        const titleLines = doc.splitTextToSize(
          recipe.title,
          pageWidth - margin * 2
        );
        doc.text(titleLines, margin, y);
        y += titleLines.length * 10;

        // Description
        if (showDescription) {
          doc.setFontSize(11);
          doc.setTextColor(75, 85, 99); // gray-600
          doc.setFont("helvetica", "normal");
          const descLines = doc.splitTextToSize(
            recipe.description,
            pageWidth - margin * 2
          );
          doc.text(descLines, margin, y);
          y += descLines.length * 5 + 5;
        }
      }

      // Divider line
      doc.setDrawColor(229, 231, 235); // gray-200
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;

      // Recipe Details
      if (showDetails) {
        const boxWidth = (pageWidth - margin * 2 - 15) / 4;
        const details = [
          { label: "Prep Time", value: `${recipe.prepTime} mins` },
          { label: "Cook Time", value: `${recipe.cookTime} mins` },
          { label: "Servings", value: `${recipe.servings}` },
          { label: "Difficulty", value: recipe.difficulty },
        ];

        details.forEach((detail, i) => {
          const x = margin + i * (boxWidth + 5);
          doc.setFillColor(249, 250, 251); // gray-50
          doc.roundedRect(x, y, boxWidth, 20, 2, 2, "F");

          doc.setFontSize(8);
          doc.setTextColor(107, 114, 128); // gray-500
          doc.text(detail.label, x + boxWidth / 2, y + 7, { align: "center" });

          doc.setFontSize(11);
          doc.setTextColor(31, 41, 55); // gray-800
          doc.setFont("helvetica", "bold");
          doc.text(detail.value, x + boxWidth / 2, y + 15, { align: "center" });
          doc.setFont("helvetica", "normal");
        });
        y += 28;
      }

      // Nutrition Info
      if (showNutrition && recipe.nutritionInfo) {
        checkNewPage(35);
        doc.setFontSize(14);
        doc.setTextColor(31, 41, 55);
        doc.setFont("helvetica", "bold");
        doc.text("Nutrition Facts", margin, y);
        y += 8;

        const nutritionBoxWidth = (pageWidth - margin * 2 - 15) / 4;
        const nutrition = [
          { label: "Calories", value: String(recipe.nutritionInfo.calories) },
          { label: "Protein", value: String(recipe.nutritionInfo.protein) },
          { label: "Carbs", value: String(recipe.nutritionInfo.carbs) },
          { label: "Fat", value: String(recipe.nutritionInfo.fat) },
        ];

        nutrition.forEach((item, i) => {
          const x = margin + i * (nutritionBoxWidth + 5);
          doc.setFillColor(249, 250, 251);
          doc.setDrawColor(229, 231, 235);
          doc.roundedRect(x, y, nutritionBoxWidth, 18, 2, 2, "FD");

          doc.setFontSize(8);
          doc.setTextColor(75, 85, 99);
          doc.text(item.label, x + nutritionBoxWidth / 2, y + 6, {
            align: "center",
          });

          doc.setFontSize(12);
          doc.setTextColor(31, 41, 55);
          doc.setFont("helvetica", "bold");
          doc.text(item.value, x + nutritionBoxWidth / 2, y + 13, {
            align: "center",
          });
          doc.setFont("helvetica", "normal");
        });
        y += 26;
      }

      // Ingredients
      if (showIngredients) {
        checkNewPage(20);
        doc.setFontSize(16);
        doc.setTextColor(31, 41, 55);
        doc.setFont("helvetica", "bold");
        doc.text(`Ingredients (${recipe.ingredients.length} items)`, margin, y);
        y += 8;

        doc.setFontSize(10);
        const colWidth = (pageWidth - margin * 2) / 2;

        recipe.ingredients.forEach((ingredient, i) => {
          checkNewPage(8);
          const col = i % 2;
          const x = margin + col * colWidth;

          // Bullet point
          doc.setFillColor(236, 72, 153);
          doc.circle(x + 2, y - 1, 1.5, "F");

          // Amount in pink
          doc.setTextColor(236, 72, 153);
          doc.setFont("helvetica", "bold");
          const amountText = `${ingredient.amount} ${ingredient.unit}`;
          doc.text(amountText, x + 6, y);

          // Item in gray
          const amountWidth = doc.getTextWidth(amountText);
          doc.setTextColor(55, 65, 81);
          doc.setFont("helvetica", "normal");
          doc.text(` ${ingredient.item}`, x + 6 + amountWidth, y);

          if (col === 1 || i === recipe.ingredients.length - 1) {
            y += 6;
          }
        });
        y += 5;
      }

      // Divider
      doc.setDrawColor(229, 231, 235);
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;

      // Instructions
      if (showInstructions) {
        checkNewPage(20);
        doc.setFontSize(16);
        doc.setTextColor(31, 41, 55);
        doc.setFont("helvetica", "bold");
        doc.text("Instructions", margin, y);
        y += 10;

        recipe.instructions.forEach((instruction, i) => {
          checkNewPage(20);

          // Step number circle
          doc.setFillColor(236, 72, 153);
          doc.circle(margin + 4, y, 4, "F");
          doc.setFontSize(10);
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          doc.text(`${i + 1}`, margin + 4, y + 1, { align: "center" });

          // Instruction text
          doc.setFontSize(10);
          doc.setTextColor(55, 65, 81);
          doc.setFont("helvetica", "normal");
          const instrLines = doc.splitTextToSize(
            instruction,
            pageWidth - margin * 2 - 15
          );
          doc.text(instrLines, margin + 12, y + 1);
          y += instrLines.length * 5 + 8;
        });
      }

      // Footer
      y = pageHeight - 10;
      doc.setDrawColor(229, 231, 235);
      doc.line(margin, y - 5, pageWidth - margin, y - 5);
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text("Generated by Sweet Recipes Hub", pageWidth / 2, y, {
        align: "center",
      });

      doc.save(`${recipe.slug}-recipe.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!recipe) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header Bar */}
      <div className="lg:hidden sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="p-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-semibold text-gray-800">Export PDF</h2>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-gray-600 hover:text-gray-800"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Mobile Settings Panel */}
      <div
        className={`lg:hidden fixed inset-x-0 top-[53px] z-10 bg-white border-b border-gray-200 shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          sidebarOpen ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500 font-medium">
              Choose what to include:
            </p>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <label className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={showImage}
                onChange={(e) => setShowImage(e.target.checked)}
                className="w-4 h-4 text-primary-500 rounded"
              />
              <span className="text-sm text-gray-700">Image</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={showDescription}
                onChange={(e) => setShowDescription(e.target.checked)}
                className="w-4 h-4 text-primary-500 rounded"
              />
              <span className="text-sm text-gray-700">Description</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={showDetails}
                onChange={(e) => setShowDetails(e.target.checked)}
                className="w-4 h-4 text-primary-500 rounded"
              />
              <span className="text-sm text-gray-700">Details</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={showNutrition}
                onChange={(e) => setShowNutrition(e.target.checked)}
                className="w-4 h-4 text-primary-500 rounded"
              />
              <span className="text-sm text-gray-700">Nutrition</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={showIngredients}
                onChange={(e) => setShowIngredients(e.target.checked)}
                className="w-4 h-4 text-primary-500 rounded"
              />
              <span className="text-sm text-gray-700">Ingredients</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={showInstructions}
                onChange={(e) => setShowInstructions(e.target.checked)}
                className="w-4 h-4 text-primary-500 rounded"
              />
              <span className="text-sm text-gray-700">Instructions</span>
            </label>
          </div>

          <button
            onClick={() => {
              handleExportPDF();
              setSidebarOpen(false);
            }}
            disabled={isExporting}
            className="w-full px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download size={18} />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 bg-white border-r border-gray-200 p-6 fixed h-full overflow-y-auto print:hidden">
          <div className="flex items-center gap-2 mb-6">
            <Settings size={20} className="text-primary-500" />
            <h2 className="text-lg font-bold text-gray-800">Export Settings</h2>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-500 font-medium">
              Choose what to include:
            </p>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-sm text-gray-700">Header Image</span>
              <input
                type="checkbox"
                checked={showImage}
                onChange={(e) => setShowImage(e.target.checked)}
                className="w-5 h-5 text-primary-500 rounded focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-sm text-gray-700">Description</span>
              <input
                type="checkbox"
                checked={showDescription}
                onChange={(e) => setShowDescription(e.target.checked)}
                className="w-5 h-5 text-primary-500 rounded focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-sm text-gray-700">Recipe Details</span>
              <input
                type="checkbox"
                checked={showDetails}
                onChange={(e) => setShowDetails(e.target.checked)}
                className="w-5 h-5 text-primary-500 rounded focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-sm text-gray-700">Nutrition Facts</span>
              <input
                type="checkbox"
                checked={showNutrition}
                onChange={(e) => setShowNutrition(e.target.checked)}
                className="w-5 h-5 text-primary-500 rounded focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-sm text-gray-700">Ingredients</span>
              <input
                type="checkbox"
                checked={showIngredients}
                onChange={(e) => setShowIngredients(e.target.checked)}
                className="w-5 h-5 text-primary-500 rounded focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-sm text-gray-700">Instructions</span>
              <input
                type="checkbox"
                checked={showInstructions}
                onChange={(e) => setShowInstructions(e.target.checked)}
                className="w-5 h-5 text-primary-500 rounded focus:ring-primary-500"
              />
            </label>
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="w-full px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Download PDF
                </>
              )}
            </button>

            <button
              onClick={() => router.back()}
              className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              Back to Recipe
            </button>
          </div>
        </aside>

        {/* Main Content - Preview */}
        <main className="flex-1 lg:ml-72 bg-white min-h-screen p-4 sm:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <header
          className={`relative rounded-xl overflow-hidden mb-6 ${
            showImage ? "h-48" : "border-b-2 border-gray-200 pb-4"
          }`}
        >
          {showImage && (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${recipe.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
            </>
          )}
          <div
            className={`relative ${
              showImage ? "h-full flex flex-col justify-end p-6" : ""
            }`}
          >
            <span
              className={`inline-flex w-fit px-3 py-1 text-sm font-medium rounded-full mb-2 ${
                showImage
                  ? "bg-primary-500 text-white"
                  : "bg-primary-100 text-primary-700"
              }`}
            >
              {recipe.category}
            </span>
            <h1
              className={`text-3xl font-bold mb-2 ${
                showImage ? "text-white" : "text-gray-900"
              }`}
            >
              {recipe.title}
            </h1>
            {showDescription && (
              <p className={showImage ? "text-white/90" : "text-gray-600"}>
                {recipe.description}
              </p>
            )}
          </div>
        </header>

        {/* Recipe Info */}
        {showDetails && (
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-6 pb-4 border-b border-gray-200">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Clock size={18} className="mx-auto mb-1 text-gray-600" />
              <p className="text-xs text-gray-500">Prep Time</p>
              <p className="font-bold text-gray-800">{recipe.prepTime} mins</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Clock size={18} className="mx-auto mb-1 text-gray-600" />
              <p className="text-xs text-gray-500">Cook Time</p>
              <p className="font-bold text-gray-800">{recipe.cookTime} mins</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Users size={18} className="mx-auto mb-1 text-gray-600" />
              <p className="text-xs text-gray-500">Servings</p>
              <p className="font-bold text-gray-800">{recipe.servings}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <ChefHat size={18} className="mx-auto mb-1 text-gray-600" />
              <p className="text-xs text-gray-500">Difficulty</p>
              <p className="font-bold text-gray-800 capitalize">
                {recipe.difficulty}
              </p>
            </div>
          </section>
        )}

        {/* Nutrition Info */}
        {recipe.nutritionInfo && showNutrition && (
          <section className="mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Nutrition Facts
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-medium">Calories</p>
                <p className="text-lg font-bold text-gray-800">
                  {recipe.nutritionInfo.calories}
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-medium">Protein</p>
                <p className="text-lg font-bold text-gray-800">
                  {recipe.nutritionInfo.protein}
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-medium">Carbs</p>
                <p className="text-lg font-bold text-gray-800">
                  {recipe.nutritionInfo.carbs}
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-medium">Fat</p>
                <p className="text-lg font-bold text-gray-800">
                  {recipe.nutritionInfo.fat}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Ingredients */}
        {showIngredients && (
          <section className="mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Ingredients ({recipe.ingredients.length} items)
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center gap-2 py-1">
                  <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></span>
                  <span className="text-gray-700">
                    <span className="font-semibold">
                      {ingredient.amount} {ingredient.unit}
                    </span>{" "}
                    {ingredient.item}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Instructions */}
        {showInstructions && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Instructions
            </h2>
            <ol className="space-y-3">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3 instruction-step">
                  <span className="flex-shrink-0 w-7 h-7 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 pt-0.5 leading-relaxed">
                    {instruction}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )}
        </main>
      </div>
    </div>
  );
}
