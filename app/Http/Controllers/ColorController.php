<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ColorController extends Controller
{
    public function generateColors(Request $request)
    {
        $request->validate([
            'quantity' => 'integer|min:1|max:50'
        ]);

        $quantity = $request->input('quantity', 1);

        try {
            // Load colors from JSON file
            $colorsPath = storage_path('data/colors.json');

            if (!file_exists($colorsPath)) {
                return response()->json([
                    'success' => false,
                    'error' => 'Color data not found'
                ], 500);
            }

            $colorsData = json_decode(file_get_contents($colorsPath), true);

            if (empty($colorsData)) {
                return response()->json([
                    'success' => false,
                    'error' => 'Invalid color data'
                ], 500);
            }

            // Randomly select colors
            $selectedColors = collect($colorsData)
                ->shuffle()
                ->take($quantity)
                ->values()
                ->all();

            return response()->json([
                'success' => true,
                'colors' => $selectedColors,
                'count' => count($selectedColors)
            ]);

        } catch (\Exception $e) {
            \Log::error('Error generating colors', [
                'error' => $e->getMessage(),
                'quantity' => $quantity
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to generate colors'
            ], 500);
        }
    }
}