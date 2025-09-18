import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { Bot, Satellite, Cloud, Bug, Beaker, Camera, Download } from 'lucide-react';

export function FieldReport() {
  const { t } = useTranslation();

  const handlePDFDownload = () => {
    // TODO: Implement PDF generation
    alert('PDF report generation would be implemented here');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t('field_report')}</h1>
        <Button onClick={handlePDFDownload} className="bg-primary hover:bg-primary/90" data-testid="button-pdf-download">
          <Download className="mr-2 h-4 w-4" />
          {t('print_pdf')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Analysis Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bot className="mr-2 h-5 w-5 text-primary" />
              {t('ai_analysis')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">{t('analysis_result')}</p>
              </div>
              <div className="flex space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">85%</div>
                  <div className="text-xs text-muted-foreground">{t('health_score')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">0.7</div>
                  <div className="text-xs text-muted-foreground">NDVI</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Sources Grid */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-primary/10 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <Satellite className="mr-2 h-4 w-4 text-primary" />
                  <h4 className="font-medium text-primary">{t('field_data')}</h4>
                </div>
                <div className="text-sm text-primary/80">{t('satellite_analysis')}</div>
              </CardContent>
            </Card>
            <Card className="bg-secondary/10 border-secondary/20">
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <Satellite className="mr-2 h-4 w-4 text-secondary" />
                  <h4 className="font-medium text-secondary">{t('satellite_data')}</h4>
                </div>
                <div className="text-sm text-secondary/80">{t('ndvi_calculated')}</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Weather Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <Cloud className="mr-2 h-4 w-4 text-card-foreground" />
                <h4 className="font-medium text-card-foreground">{t('weather_data')}</h4>
              </div>
              <div className="bg-accent/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-accent">{t('weather_report')}</p>
                    <p className="text-sm text-muted-foreground">{t('rain_expected')}</p>
                  </div>
                  <div className="text-2xl">🌧️</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pest Detection Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bug className="mr-2 h-5 w-5" />
              {t('pest_detection')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <div className="w-10 h-10 bg-destructive rounded-full flex items-center justify-center">
                <Bug className="text-destructive-foreground h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-destructive">{t('pest_detected')}</p>
                <p className="text-sm text-muted-foreground">{t('pest_description')}</p>
              </div>
              <Button size="sm" className="bg-accent hover:bg-accent/90" data-testid="button-pest-scan">
                <Camera className="mr-2 h-4 w-4" />
                {t('scan')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Soil Health Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Beaker className="mr-2 h-5 w-5" />
              {t('soil_health')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <div className="text-lg font-bold text-primary">6.5</div>
                  <div className="text-xs text-muted-foreground">pH</div>
                </div>
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <div className="text-lg font-bold text-secondary">120</div>
                  <div className="text-xs text-muted-foreground">N (kg/ha)</div>
                </div>
                <div className="p-3 bg-accent/10 rounded-lg">
                  <div className="text-lg font-bold text-accent">45</div>
                  <div className="text-xs text-muted-foreground">P (kg/ha)</div>
                </div>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-primary font-medium">{t('fertilizer_recommendation')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
