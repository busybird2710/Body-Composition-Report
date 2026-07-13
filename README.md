# VitalMetrics Pro - Wellness Report Generator

A comprehensive, open-source body composition and health analysis web application that generates professional wellness reports based on anthropometric measurements. Designed to integrate with HBF-357 body composition monitors.

## 🌟 Features

- **Professional Wellness Reports**: Generate detailed PDF reports with body composition analysis
- **Automatic Calculations**: BMI, BMR, and biological age calculated automatically
- **HBF-357 Integration**: Connect to HBF-357 body composition monitors via Bluetooth
- **Mobile & Email Delivery**: Send reports directly via WhatsApp or Email
- **Gender-Specific Ranges**: Different target ranges for male and female individuals
- **Real-time Validation**: Instant feedback on biomarker status
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Print-Ready Reports**: Professional PDF generation for archival

## 📊 Measured Parameters

1. **Trunk Subcutaneous Fat (TSF)** - Fat stored beneath skin in abdominal region
2. **Skeletal Muscle Mass** - Percentage of voluntary muscle tissue
3. **Total Body Fat** - Overall body fat percentage
4. **Visceral Fat Level** - Deep abdominal fat around organs
5. **BMI (Body Mass Index)** - Weight-to-height ratio
6. **BMR (Basal Metabolic Rate)** - Resting caloric requirement
7. **Biological Age** - Calculated based on body composition markers

## 🚀 Quick Start

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- For HBF-357 integration: Browser with Web Bluetooth API support (Chrome/Edge recommended)

### Installation

1. **Download the project**
   ```
   Download all files to a local directory
   ```

2. **Open in browser**
   ```
   Simply open index.html in your web browser
   ```

3. **No server required!**
   - This is a client-side application
   - All calculations happen in the browser
   - No backend or database needed

## 📱 HBF-357 Machine Integration

### Supported Devices
- OMRON HBF-357 Body Composition Monitor
- Other Bluetooth-enabled OMRON body composition scales

### Connection Steps

1. **Enable Bluetooth** on your computer/device
2. **Turn on** your HBF-357 monitor
3. Click **"Connect HBF-357 Device"** button
4. Select your device from the Bluetooth pairing dialog
5. Stand on the scale when prompted
6. Data will automatically populate the form fields

### Bluetooth API Support

The Web Bluetooth API is supported in:
- ✅ Chrome (Desktop & Android)
- ✅ Edge (Desktop)
- ✅ Opera (Desktop & Android)
- ❌ Firefox (Experimental - requires flag)
- ❌ Safari (Not supported)

**Note**: If Bluetooth connection fails, the app provides a demo mode with sample data for testing.

## 🧮 Calculation Formulas

### BMI (Body Mass Index)
```
BMI = weight(kg) / [height(m)]²
```

### BMR (Basal Metabolic Rate) - Mifflin-St Jeor Equation
**For Males:**
```
BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
```

**For Females:**
```
BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161
```

### Biological Age Calculation
Calculated based on deviations from target ranges:
- BMI impact: ±0.5-0.8 years per point deviation
- Body fat impact: ±0.4 years per percentage point
- Muscle mass impact: ±0.5 years per percentage point
- Visceral fat impact: ±0.7 years per point deviation
- Trunk fat impact: ±0.3 years per percentage point

### Wellness Index (0-100)
```
Score = 100 - (sum of all parameter deviations × penalty factors)
```
- 80-100: Excellent
- 60-79: Good
- 40-59: Fair
- 20-39: Needs Attention
- 0-19: Critical

## 🎯 Target Ranges

### Male
| Parameter | Target Range |
|-----------|--------------|
| Trunk Subcutaneous Fat | 8 - 15% |
| Skeletal Muscle Mass | 33 - 36% |
| Total Body Fat | 14 - 17% |
| Visceral Fat Level | 2 - 8 |
| BMI | 18.5 - 24.9 kg/m² |

### Female
| Parameter | Target Range |
|-----------|--------------|
| Trunk Subcutaneous Fat | 20 - 23% |
| Skeletal Muscle Mass | 30 - 33% |
| Total Body Fat | 20 - 23% |
| Visceral Fat Level | 2 - 8 |
| BMI | 18.5 - 24.9 kg/m² |

*Reference ranges derived from WHO, ACSM, and metabolic cardiovascular standards*

## 📄 File Structure

```
evolve-fit-family/
│
├── index.html              # Main form page
├── styles.css              # Form styling
├── script.js               # Form logic & calculations
│
├── report.html             # Report display page
├── report-styles.css       # Report styling
├── report-script.js        # Report generation logic
│
├── README.md               # This file
└── LICENSE                 # MIT License
```

## 🔧 Customization

### Changing Coach Details
Edit `index.html` lines with default coach information:
```html
<input type="text" id="coachName" name="coachName" value="P Malathi">
<input type="tel" id="coachMobile" name="coachMobile" value="9823152302">
```

### Modifying Target Ranges
Edit `script.js` in the `targetRanges` object:
```javascript
const targetRanges = {
    male: {
        trunkFat: { min: 8, max: 15, unit: '%' },
        // ... modify values here
    },
    female: {
        // ... modify values here
    }
};
```

### Adjusting Biological Age Formula
Edit the `calculateBiologicalAge()` function in `script.js` to adjust aging impact factors.

## 📧 Report Delivery

### WhatsApp Integration
- Automatically formats message with key findings
- Opens WhatsApp Web/App with pre-filled message
- Requires valid phone number with country code

### Email Integration
- Pre-fills email subject and body
- Opens default email client
- Attaches comprehensive report summary

### PDF Download
- Click "Download PDF" or use browser's Print function (Ctrl+P / Cmd+P)
- Select "Save as PDF" as printer
- Optimized for A4 paper size

## 🔒 Privacy & Security

- **No data transmission**: All calculations happen locally in the browser
- **No server storage**: No data is sent to any server
- **Session-based**: Data cleared when browser is closed
- **HIPAA considerations**: Suitable for confidential health assessments
- **Open source**: Full transparency - review all code

## 🌐 Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Recommended for Bluetooth |
| Edge | ✅ Full | Recommended for Bluetooth |
| Firefox | ✅ Partial | No Bluetooth support |
| Safari | ✅ Partial | No Bluetooth support |
| Mobile Browsers | ✅ Yes | Responsive design |

## 📱 Mobile App Integration (Future)

For full Bluetooth integration on mobile devices, consider:
- Wrapping in **Cordova/PhoneGap**
- Using **React Native** with Bluetooth libraries
- **Flutter** with bluetooth_low_energy package

## 🤝 Contributing

This is an open-source project. Contributions are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📜 License

MIT License - Feel free to use, modify, and distribute.

## ⚠️ Disclaimer

This tool is for educational and wellness tracking purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers regarding medical conditions and health decisions.

## 📞 Support

For questions, issues, or feature requests:
- Create an issue on the repository
- Contact: VitalMetrics Pro Team

## 🙏 Acknowledgments

- WHO (World Health Organization) for BMI standards
- ACSM (American College of Sports Medicine) for fitness guidelines
- Mifflin-St Jeor for BMR equation
- OMRON for HBF-357 specifications

## 📈 Version History

### v1.0.5 (Current)
- Initial public release
- Full body composition analysis
- HBF-357 Bluetooth integration
- Biological age calculation
- WhatsApp/Email delivery
- PDF export functionality

---

**Built with ❤️ for the VitalMetrics Pro community**
"# Body-Composition-Report" 
