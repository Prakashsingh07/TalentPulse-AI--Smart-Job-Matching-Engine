export const config = {
  port: process.env.PORT || 5000,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  jwtSecret: process.env.JWT_SECRET || 'TalentPulse_Super_Secret_Production_Key_2026_Enterprise'
};
