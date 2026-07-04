import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Compass, Sparkles, ThumbsUp } from 'lucide-react';

export default function AnalyticsDashboard({ destination, darkMode }) {
  
  // KPI Metrics Data
  const metrics = [
    {
      title: "Cultural Density Index",
      value: `${destination.culturalDensity}%`,
      description: "Concentration of historic sites and landmarks",
      icon: <Compass className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      colorClass: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400"
    },
    {
      title: "Visitor Sentiment Score",
      value: `${destination.sentimentScore}/100`,
      description: "Aggregated rating based on tips and check-ins",
      icon: <ThumbsUp className="w-5 h-5 text-blue-500" />,
      colorClass: "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400"
    }
  ];

  // Theme configuration for ECharts
  const textColor = darkMode ? '#e4e4e7' : '#27272a';
  const tooltipBg = darkMode ? '#18181b' : '#ffffff';
  const tooltipBorder = darkMode ? '#27272a' : '#e4e4e7';

  // Pie Chart options for Category Breakdown
  const pieChartOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      borderWidth: 1,
      textStyle: { color: textColor, fontFamily: 'DM Sans, sans-serif', fontSize: 12 },
      formatter: '{b}: <b>{c}%</b>'
    },
    legend: {
      bottom: '5%',
      left: 'center',
      textStyle: { color: textColor, fontFamily: 'DM Sans, sans-serif', fontSize: 11 },
      itemWidth: 10,
      itemHeight: 10,
      icon: 'circle'
    },
    color: ['#059669', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'],
    series: [
      {
        name: 'Cultural Makeup',
        type: 'pie',
        radius: ['45%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: darkMode ? '#0c0c0f' : '#ffffff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            fontFamily: 'DM Sans, sans-serif',
            color: textColor
          }
        },
        labelLine: {
          show: false
        },
        data: destination.categoryStats || []
      }
    ]
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">
      
      {/* Metrics Cards Grid (KPI Row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                {m.title}
              </span>
              <p className="text-3xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight">
                {m.value}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans font-light">
                {m.description}
              </p>
            </div>
            
            <div className={`p-3 rounded-xl ${m.colorClass} flex-shrink-0`}>
              {m.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Analytical Charts Gallery - Strictly 1 Chart Per Row */}
      <div className="space-y-6">
        
        {/* Chart 1 Card */}
        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-white text-sm">
                Cultural Focus Distribution
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Analytical breakdown of regional attractions and activities by cultural subcategory
              </p>
            </div>
          </div>

          <div className="h-[320px] w-full">
            <ReactECharts 
              option={pieChartOption} 
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'svg' }} // Vector rendering for crisp look
            />
          </div>
        </div>

      </div>

    </div>
  );
}
