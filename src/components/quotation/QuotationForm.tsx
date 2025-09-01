import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Calculator, Save, FileText, Printer } from 'lucide-react';

interface QuotationData {
  bookSize: string;
  paperType: string;
  interiorType: string;
  pageCount: number;
  copies: number;
  coverType: string;
  finishing: number;
  includeDesign: boolean;
  includeISBN: boolean;
}

interface QuotationFormProps {
  onSave?: (data: QuotationData & { finalPrice: number }) => void;
  onBack?: () => void;
}

export function QuotationForm({ onSave, onBack }: QuotationFormProps) {
  const [formData, setFormData] = useState<QuotationData>({
    bookSize: '',
    paperType: '',
    interiorType: '',
    pageCount: 0,
    copies: 0,
    coverType: '',
    finishing: 0,
    includeDesign: false,
    includeISBN: false,
  });

  const [calculation, setCalculation] = useState({
    paperCost: 0,
    tonerCost: 0,
    coverCost: 0,
    finishingCost: 0,
    packagingCost: 0,
    bhr: 0,
    designCost: 0,
    isbnCost: 0,
    rawCost: 0,
    profitPercentage: 0,
    finalPrice: 0,
  });

  // Lookup tables (in production, these would come from Supabase)
  const lookupTables = {
    bookSizes: [
      { value: 'A6', label: 'A6', factor: 8 },
      { value: 'A5', label: 'A5', factor: 4 },
      { value: '6x9', label: '6x9', factor: 2 },
      { value: '7x10', label: '7x10', factor: 2 },
      { value: 'A4', label: 'A4', factor: 2 },
      { value: 'A3', label: 'A3', factor: 1 },
    ],
    paperTypes: [
      'Cream 100gsm',
      'Cream 80gsm',
      'Cream 70gsm',
      'White 80gsm',
      'White 70gsm',
      'Gloss 135gsm',
      'Gloss 115gsm',
    ],
    interiorTypes: ['B/W', 'Colour'],
    coverTypes: ['Soft', 'Hard', 'Folded'],
    
    // Mock pricing - replace with real Supabase data
    paperCosts: {
      'A6-Cream 100gsm': 5,
      'A5-Cream 100gsm': 8,
      'A4-Cream 100gsm': 12,
      // ... more combinations
    },
    tonerCosts: {
      'A6-B/W': 3,
      'A5-B/W': 5,
      'A4-B/W': 8,
      'A6-Colour': 15,
      'A5-Colour': 25,
      'A4-Colour': 40,
    },
    coverCosts: {
      'A6-Soft': 200,
      'A5-Soft': 300,
      'A4-Soft': 500,
      'A6-Hard': 800,
      'A5-Hard': 1200,
      'A4-Hard': 2000,
    },
    packagingCosts: {
      'A6': 50,
      'A5': 75,
      'A4': 100,
    },
    profitBrackets: [
      { min: 0, max: 100, percentage: 0.3 },
      { min: 101, max: 500, percentage: 0.25 },
      { min: 501, max: 1000, percentage: 0.2 },
      { min: 1001, max: Infinity, percentage: 0.15 },
    ],
  };

  // Auto-calculate finishing cost based on page count
  useEffect(() => {
    if (formData.pageCount > 0) {
      const finishingCost = Math.ceil(formData.pageCount / 4) * 50; // Mock formula
      setFormData(prev => ({ ...prev, finishing: finishingCost }));
    }
  }, [formData.pageCount]);

  // Calculate quotation whenever form data changes
  useEffect(() => {
    calculateQuotation();
  }, [formData]);

  const calculateQuotation = () => {
    const { bookSize, paperType, interiorType, pageCount, copies, coverType, finishing, includeDesign, includeISBN } = formData;
    
    if (!bookSize || !paperType || !interiorType || !pageCount || !copies || !coverType) {
      return;
    }

    // Paper Cost
    const paperCostPerPage = lookupTables.paperCosts[`${bookSize}-${paperType}`] || 10;
    const paperCost = paperCostPerPage * pageCount * copies;

    // Toner Cost
    const tonerCostPerPage = lookupTables.tonerCosts[`${bookSize}-${interiorType}`] || 5;
    const tonerCost = tonerCostPerPage * pageCount * copies;

    // Cover Cost
    const coverCostPerUnit = lookupTables.coverCosts[`${bookSize}-${coverType}`] || 500;
    const coverCost = coverCostPerUnit * copies;

    // Finishing Cost
    const finishingCost = finishing * copies;

    // Packaging Cost
    const packagingCostPerUnit = lookupTables.packagingCosts[bookSize] || 100;
    const packagingCost = packagingCostPerUnit * copies;

    // BHR Calculation
    const sizeData = lookupTables.bookSizes.find(s => s.value === bookSize);
    const factor = sizeData?.factor || 4;
    const bhr = ((pageCount / factor) / 48) * copies * 3000;

    // Additional Costs
    const designCost = includeDesign ? 10000 : 0;
    const isbnCost = includeISBN ? 8000 : 0;

    // Raw Cost
    const rawCost = paperCost + tonerCost + coverCost + finishingCost + packagingCost + bhr + designCost + isbnCost;

    // Profit Calculation
    const profitBracket = lookupTables.profitBrackets.find(b => copies >= b.min && copies <= b.max);
    const profitPercentage = profitBracket?.percentage || 0.2;

    // Final Price
    const finalPrice = rawCost * (1 + profitPercentage);

    setCalculation({
      paperCost,
      tonerCost,
      coverCost,
      finishingCost,
      packagingCost,
      bhr,
      designCost,
      isbnCost,
      rawCost,
      profitPercentage: profitPercentage * 100,
      finalPrice,
    });
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ ...formData, finalPrice: calculation.finalPrice });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">New Quotation</h1>
          <p className="text-muted-foreground">
            Generate a detailed printing quotation
          </p>
        </div>
        <div className="flex gap-2">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Back to Dashboard
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Book Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="form-grid">
              <div className="space-y-2">
                <Label htmlFor="bookSize">Book Size</Label>
                <Select value={formData.bookSize} onValueChange={(value) => setFormData(prev => ({ ...prev, bookSize: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {lookupTables.bookSizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paperType">Paper Type</Label>
                <Select value={formData.paperType} onValueChange={(value) => setFormData(prev => ({ ...prev, paperType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select paper" />
                  </SelectTrigger>
                  <SelectContent>
                    {lookupTables.paperTypes.map((paper) => (
                      <SelectItem key={paper} value={paper}>
                        {paper}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interiorType">Interior Type</Label>
                <Select value={formData.interiorType} onValueChange={(value) => setFormData(prev => ({ ...prev, interiorType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select interior" />
                  </SelectTrigger>
                  <SelectContent>
                    {lookupTables.interiorTypes.map((interior) => (
                      <SelectItem key={interior} value={interior}>
                        {interior}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pageCount">Page Count</Label>
                <Input
                  id="pageCount"
                  type="number"
                  value={formData.pageCount || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, pageCount: parseInt(e.target.value) || 0 }))}
                  placeholder="Enter pages"
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="copies">Copies</Label>
                <Input
                  id="copies"
                  type="number"
                  value={formData.copies || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, copies: parseInt(e.target.value) || 0 }))}
                  placeholder="Enter quantity"
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverType">Cover Type</Label>
                <Select value={formData.coverType} onValueChange={(value) => setFormData(prev => ({ ...prev, coverType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cover" />
                  </SelectTrigger>
                  <SelectContent>
                    {lookupTables.coverTypes.map((cover) => (
                      <SelectItem key={cover} value={cover}>
                        {cover}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="finishing">Finishing Cost (₦)</Label>
                <Input
                  id="finishing"
                  type="number"
                  value={formData.finishing || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, finishing: parseInt(e.target.value) || 0 }))}
                  placeholder="Auto-calculated"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="includeDesign"
                  checked={formData.includeDesign}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeDesign: checked }))}
                />
                <Label htmlFor="includeDesign">Include Design (₦10,000)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="includeISBN"
                  checked={formData.includeISBN}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeISBN: checked }))}
                />
                <Label htmlFor="includeISBN">Include ISBN (₦8,000)</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calculation Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quotation Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Paper Cost:</span>
                  <span>₦{calculation.paperCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Toner Cost:</span>
                  <span>₦{calculation.tonerCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cover Cost:</span>
                  <span>₦{calculation.coverCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Finishing Cost:</span>
                  <span>₦{calculation.finishingCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Packaging Cost:</span>
                  <span>₦{calculation.packagingCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>BHR:</span>
                  <span>₦{calculation.bhr.toLocaleString()}</span>
                </div>
                {formData.includeDesign && (
                  <div className="flex justify-between">
                    <span>Design Cost:</span>
                    <span>₦{calculation.designCost.toLocaleString()}</span>
                  </div>
                )}
                {formData.includeISBN && (
                  <div className="flex justify-between">
                    <span>ISBN Cost:</span>
                    <span>₦{calculation.isbnCost.toLocaleString()}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between font-medium">
                  <span>Raw Cost:</span>
                  <span>₦{calculation.rawCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Profit ({calculation.profitPercentage}%):</span>
                  <span>₦{(calculation.finalPrice - calculation.rawCost).toLocaleString()}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold text-primary">
                  <span>Final Price:</span>
                  <span>₦{calculation.finalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Button onClick={handleSave} className="w-full" disabled={calculation.finalPrice === 0}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Quote
                </Button>
                <Button variant="outline" className="w-full" disabled={calculation.finalPrice === 0}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}