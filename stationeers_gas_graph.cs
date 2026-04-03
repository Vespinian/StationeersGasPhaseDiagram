
  public const double SPECIFIC_HEAT_CARBON_DIOXIDE = 28.2;
  public const float TRIPLE_POINT_PRESSURE_CARBON_DIOXIDE = 517f;
  public const float LATENT_HEAT_CARBON_DIOXIDE = 600f;
  public const float CRITICAL_PRESSURE_CARBON_DIOXIDE = 6000f;
  public static readonly TemperatureKelvin TRIPLE_POINT_TEMPERATURE_CARBON_DIOXIDE_K = MoleHelper.EvaporationTemperature(Chemistry.GasType.CarbonDioxide, new PressurekPa(517.0));
  public static readonly TemperatureKelvin CRITICAL_TEMPERATURE_CARBON_DIOXIDE_K = MoleHelper.EvaporationTemperature(Chemistry.GasType.CarbonDioxide, new PressurekPa(6000.0));
  public const double SPECIFIC_HEAT_POLLUTANT = 24.8;
  public const float TRIPLE_POINT_PRESSURE_POLLUTANT = 1800f;
  public const float LATENT_HEAT_POLLUTANT = 2000f;
  public const float CRITICAL_PRESSURE_POLLUTANT = 6000f;
  public static readonly TemperatureKelvin TRIPLE_POINT_TEMPERATURE_POLLUTANT_K = MoleHelper.EvaporationTemperature(Chemistry.GasType.Pollutant, new PressurekPa(1800.0));
  public static readonly TemperatureKelvin CRITICAL_TEMPERATURE_POLLUTANT_K = MoleHelper.EvaporationTemperature(Chemistry.GasType.Pollutant, new PressurekPa(6000.0));
  public const double SPECIFIC_HEAT_NITROGEN_DIOXIDE = 37.2;
  public const float TRIPLE_POINT_PRESSURE_NITROGEN_DIOXIDE = 800f;
  public const float LATENT_HEAT_NITROGEN_DIOXIDE = 4000f;
  public const float CRITICAL_PRESSURE_NITROGEN_DIOXIDE = 2000f;
  public static readonly TemperatureKelvin TRIPLE_POINT_TEMPERATURE_NITROGEN_DIOXIDE_K = MoleHelper.EvaporationTemperature(Chemistry.GasType.NitrousOxide, new PressurekPa(800.0));
  public static readonly TemperatureKelvin CRITICAL_TEMPERATURE_NITROGEN_DIOXIDE_K = MoleHelper.EvaporationTemperature(Chemistry.GasType.NitrousOxide, new PressurekPa(2000.0));
  public const double ENTHALPY_MULTIPLIER_NITROGEN_DIOXIDE = 2.0;
  public const double AUTO_IGNITION_OFFSET_NITROGEN_DIOXIDE = -250.0;
  public static readonly TemperatureKelvin AutoIgnitionOffsetNitrogenDioxide = new TemperatureKelvin(-250.0);
  public const double SPECIFIC_HEAT_NITROGEN = 20.6;
  public const float TRIPLE_POINT_PRESSURE_NITROGEN = 6.3f;
  public const float LATENT_HEAT_NITROGEN = 500f;
  public const float CRITICAL_PRESSURE_NITROGEN = 6000f;
  public static readonly TemperatureKelvin FREEZING_TEMPERATURE_NITROGEN_K = MoleHelper.EvaporationTemperature(Chemistry.GasType.Nitrogen, new PressurekPa(6.3000001907348633));
  public static readonly TemperatureKelvin CRITICAL_TEMPERATURE_NITROGEN_K = MoleHelper.EvaporationTemperature(Chemistry.GasType.Nitrogen, new PressurekPa(6000.0));
  public const double SPECIFIC_HEAT_OXYGEN = 21.1;
  public const float TRIPLE_POINT_PRESSURE_OXYGEN = 6.3f;
  public const float LATENT_HEAT_OXYGEN = 800f;
  public const float CRITICAL_PRESSURE_OXYGEN = 6000f;
  public static readonly TemperatureKelvin TRIPLE_POINT_TEMPERATURE_OXYGEN_K = MoleHelper.EvaporationTemperature(Chemistry.GasType.Oxygen, new PressurekPa(6.3000001907348633));
  public static readonly TemperatureKelvin CRITICAL_TEMPERATURE_OXYGEN_K = MoleHelper.EvaporationTemperature(Chemistry.GasType.Oxygen, new PressurekPa(6000.0));
  public const double ENTHAPLY_MULTILPIER_OXYGEN = 1.0;
  public const double SPECIFIC_HEAT_METHANE = 20.4;
  public const float TRIPLE_POINT_PRESSURE_METHANE = 6.3f;
  public const float LATENT_HEAT_METHANE = 1000f;
  public const float CRITICAL_PRESSURE_METHANE = 6000f;
  public const float ENTHALPY_METHANE = 286000f;
  public static readonly TemperatureKelvin TRIPLE_POINT_TEMPERATURE_METHANE_K = MoleHelper.EvaporationTemperature(Chemistry.GasType.Methane, new PressurekPa(6.3000001907348633));
  public static readonly TemperatureKelvin CRITICAL_TEMPERATURE_METHANE_K = MoleHelper.EvaporationTemperature(Chemistry.GasType.Methane, new PressurekPa(6000.0));
  private const double METHANE_AUTOIGNITION = 573.15;
  public static readonly TemperatureKelvin AutoIgnitionMethane = new TemperatureKelvin(573.15);
  public const double SPECIFIC_HEAT_WATER = 72.0;
  public const float LATENT_HEAT_WATER = 8000f;
  public const float CRITICAL_PRESSURE_WATER = 6000f;
  public const float TRIPLE_POINT_PRESSURE_WATER = 6.3f;
  private const float _TRIPLE_POINT_TEMPERATURE_WATER_K = 273.15f;
  public static readonly TemperatureKelvin TRIPLE_POINT_TEMPERATURE_WATER_K = new TemperatureKelvin(273.14999389648437);
  public static readonly TemperatureKelvin CRITICAL_TEMPERATURE_WATER_K = MoleHelper.EvaporationTemperature(Chemistry.GasType.Water, new PressurekPa(6000.0));
  public const double SPECIFIC_HEAT_POLLUTED_WATER = 72.0;
  public const float TRIPLE_POINT_PRESSURE_POLLUTED_WATER = 6.3f;
  public const float LATENT_HEAT_POLLUTED_WATER = 8000f;
  public const float CRITICAL_PRESSURE_POLLUTED_WATER = 6000f;
  private const float _TRIPLE_POINT_TEMPERATURE_POLLUTED_WATER_K = 276.15f;
  public static readonly TemperatureKelvin TRIPLE_POINT_TEMPERATURE_POLLUTED_WATER_K = new TemperatureKelvin(276.14999389648437);
  public static readonly TemperatureKelvin CRITICAL_TEMPERATURE_POLLUTED_WATER_K = MoleHelper.EvaporationTemperature(Chemistry.GasType.PollutedWater, new PressurekPa(6000.0));
  public const double SPECIFIC_HEAT_HYDROGEN = 20.4;
  public const float TRIPLE_POINT_PRESSURE_HYDROGEN = 6.3f;
  public const float LATENT_HEAT_HYDROGEN = 200f;
  public const float CRITICAL_PRESSURE_HYDROGEN = 6000f;
  public const double MOLAR_VOLUME_LIQUID_HYDROGEN = 0.028;
  public const double ENTHALPY_HYDROGEN = 306000.0;
  public static readonly TemperatureKelvin TRIPLE_POINT_TEMPERATURE_HYDROGEN_K = MoleHelper.EvaporationTemperature(Chemistry.GasType.Hydrogen, new PressurekPa(6.3000001907348633));
  public static readonly TemperatureKelvin CRITICAL_TEMPERATURE_HYDROGEN_K = MoleHelper.EvaporationTemperature(Chemistry.GasType.Hydrogen, new PressurekPa(6000.0));
  private const double HYDROGEN_AUTOIGNITION = 573.15;
  public static readonly TemperatureKelvin AutoIgnitionHydrogen = new TemperatureKelvin(573.15);
  public const double SPECIFIC_HEAT_HYDRAZINE = 48.4;
  public const double MINIMUM_LIQUID_PRESSURE_HYDRAZINE = 6.3;
  public const double LATENT_HEAT_HYDRAZINE = 4000.0;
  public const double CRITICAL_PRESSURE_HYDRAZINE = 6000.0;
  public const double MOLAR_VOLUME_HYDRAZINE = 0.03;
  public const double ENTHALPY_HYDRAZINE = 306000.0;
  public const double COEFFIENT_A_HYDRAZINE = 8E-22;
  public const double COEFFIENT_B_HYDRAZINE = 9.15642808045339;
  public static readonly TemperatureKelvin FREEZING_POINT_HYDRAZINE = MoleHelper.EvaporationTemperature(Chemistry.GasType.Hydrazine, new PressurekPa(6.3));
  public static readonly TemperatureKelvin CRITICAL_TEMPERATURE_HYDRAZINE_K = MoleHelper.EvaporationTemperature(Chemistry.GasType.Hydrazine, new PressurekPa(6000.0));
  public const double SPECIFIC_HEAT_ETHANOL = 33.0;
  public const double MINIMUM_LIQUID_PRESSURE_ETHANOL = 6.3;
  public const double LATENT_HEAT_ETHANOL = 2000.0;
  public const double CRITICAL_PRESSURE_ETHANOL = 1000.0;
  public const double MOLAR_VOLUME_ETHANOL = 0.058;
  public const double ENTHALPY_ETHANOL = 566000.0;
  public const double COEFFICIENT_A_ETHANOL = 9E-20;
  public const double COEFFICIENT_B_ETHANOL = 8.3918844460789863;
  private const double AUTOIGNITION_ALCOHOL = 673.15;
  public static readonly TemperatureKelvin FREEZING_POINT_ETHANOL = MoleHelper.EvaporationTemperature(Chemistry.GasType.LiquidAlcohol, new PressurekPa(6.3));
  public static readonly TemperatureKelvin CRITICAL_TEMPERATURE_ETHANOL_K = MoleHelper.EvaporationTemperature(Chemistry.GasType.LiquidAlcohol, new PressurekPa(1000.0));
  public static readonly TemperatureKelvin AutoIgnitionAlcohol = new TemperatureKelvin(673.15);
  public const double SPECIFIC_HEAT_HELIUM = 20.8;
  public const double MINIMUM_LIQUID_PRESSURE_HELIUM = 0.0;
  public const double LATENT_HEAT_HELIUM = 0.0;
  public static readonly TemperatureKelvin CRITICAL_TEMPERATURE_HELIUM_K = TemperatureKelvin.Zero;
  public static readonly TemperatureKelvin FREEZING_POINT_HELIUM = TemperatureKelvin.Zero;
  public const double SPECIFIC_HEAT_SODIUM_CHLORIDE = 130.0;
  public const double MINIMUM_LIQUID_PRESSURE_SODIUM_CHLORIDE = 6.3;
  public const double CRITICAL_PRESSURE_SODIUM_CHLORIDE = 515.0;
  public const double LATENT_HEAT_SODIUM_CHLORIDE = 16000.0;
  public const double MOLAR_VOLUME_SODIUM_CHLORIDE = 0.04;
  public static readonly TemperatureKelvin FREEZING_POINT_SODIUMCHLORIDE = MoleHelper.EvaporationTemperature(Chemistry.GasType.LiquidSodiumChloride, new PressurekPa(6.3));
  public static readonly TemperatureKelvin CRITICAL_TEMPERATURE_SODIUMCHLORIDE = MoleHelper.EvaporationTemperature(Chemistry.GasType.LiquidSodiumChloride, new PressurekPa(515.0));
  public const double COEFFICIENT_A_SODIUMCHLORIDE = 6.211737044295E-08;
  public const double COEFFICIENT_B_SODIUMCHLORIDE = 2.8774143233482707;
  public const double SPECIFIC_HEAT_COOLANT = 101.0;
  public const double MINIMUM_LIQUID_PRESSURE_SILANOL = 516.0;
  public const double LATENT_HEAT_COOLANT = 10000.0;
  public const double CRITICAL_PRESSURE_COOLANT = 6000.0;
  public const double MOLAR_VOLUME_SILANOL = 0.16;
  public const double COEFFICIENT_A_COOLANT = 0.22176555607618392;
  public const double COEFFICIENT_B_COOLANT = 1.5206578718752168;
  public static readonly TemperatureKelvin FREEZING_POINT_SILANOL = MoleHelper.EvaporationTemperature(Chemistry.GasType.Silanol, new PressurekPa(516.0));
  public static readonly TemperatureKelvin CRITICAL_TEMPERATURE_SILANOL_K = MoleHelper.EvaporationTemperature(Chemistry.GasType.Silanol, new PressurekPa(6000.0));
  public const double SPECIFIC_HEAT_HYDROCHLORIC_ACID = 37.0;
  public const double MINIMUM_LIQUID_PRESSURE_HYDROCHLORIC_ACID = 6.3;
  public const double LATENT_HEAT_HYDROCHLORIC_ACID = 1000.0;
  public const double CRITICAL_PRESSURE_HYDROCHLORIC_ACID = 1000.0;
  public const double MOLAR_VOLUME_HYDROCHLORIC_ACID = 0.028;
  public const double COEFFICIENT_A_HYDROCHLORIC_ACID = 1E-21;
  public const double COEFFICIENT_B_HYDROCHLORIC_ACID = 9.1088444607898627;
  public static readonly TemperatureKelvin FREEZING_POINT_HYDROCHLORIC_ACID = MoleHelper.EvaporationTemperature(Chemistry.GasType.HydrochloricAcid, new PressurekPa(6.3));
  public static readonly TemperatureKelvin CRITICAL_TEMPERATURE_HYDROCHLORIC_ACID_K = MoleHelper.EvaporationTemperature(Chemistry.GasType.HydrochloricAcid, new PressurekPa(1000.0));
  public const double SPECIFIC_HEAT_OZONE = 38.6;
  public const double MINIMUM_LIQUID_PRESSURE_OZONE = 250.0;
  public const double LATENT_HEAT_OZONE = 1000.0;
  public const double CRITICAL_PRESSURE_OZONE = 6000.0;
  public const double MOLAR_VOLUME_OZONE = 0.026;
  public const double COEFFICIENT_A_OZONE = 0.0062197638230437179;
  public const double COEFFICIENT_B_OZONE = 2.4097251251207226;
  public static readonly TemperatureKelvin FREEZING_POINT_OZONE = MoleHelper.EvaporationTemperature(Chemistry.GasType.Ozone, new PressurekPa(250.0));
  public static readonly TemperatureKelvin CRITICAL_TEMPERATURE_OZONE_K = MoleHelper.EvaporationTemperature(Chemistry.GasType.Ozone, new PressurekPa(6000.0));

  private static double EvaporationCoefficientA(Chemistry.GasType gasType)
  {
    switch (gasType)
    {
      case Chemistry.GasType.Oxygen:
      case Chemistry.GasType.LiquidOxygen:
        return 2.6854996004E-11;
      case Chemistry.GasType.Nitrogen:
      case Chemistry.GasType.LiquidNitrogen:
        return 5.5757107833E-07;
      case Chemistry.GasType.CarbonDioxide:
      case Chemistry.GasType.LiquidCarbonDioxide:
        return 1.579573E-26;
      case Chemistry.GasType.Methane:
      case Chemistry.GasType.LiquidMethane:
        return 5.863496734E-15;
      case Chemistry.GasType.Pollutant:
      case Chemistry.GasType.LiquidPollutant:
        return 2.079033884;
      case Chemistry.GasType.Water:
      case Chemistry.GasType.Steam:
        return 3.8782059839E-19;
      case Chemistry.GasType.NitrousOxide:
      case Chemistry.GasType.LiquidNitrousOxide:
        return 0.065353501531;
      case Chemistry.GasType.Hydrogen:
      case Chemistry.GasType.LiquidHydrogen:
        return 3.18041E-05;
      case Chemistry.GasType.PollutedWater:
        return 4E-20;
      case Chemistry.GasType.Hydrazine:
      case Chemistry.GasType.LiquidHydrazine:
        return 8E-22;
      case Chemistry.GasType.LiquidAlcohol:
        return 9E-20;
      case Chemistry.GasType.Helium:
        return 0.0;
      case Chemistry.GasType.LiquidSodiumChloride:
        return 6.211737044295E-08;
      case Chemistry.GasType.Silanol:
      case Chemistry.GasType.LiquidSilanol:
        return 0.22176555607618392;
      case Chemistry.GasType.HydrochloricAcid:
      case Chemistry.GasType.LiquidHydrochloricAcid:
        return 1E-21;
      case Chemistry.GasType.Ozone:
      case Chemistry.GasType.LiquidOzone:
        return 0.0062197638230437179;
      default:
        throw new ArgumentOutOfRangeException(nameof (gasType), (object) gasType, (string) null);
    }
  }

  private static double EvaporationCoefficientB(Chemistry.GasType gasType)
  {
    switch (gasType)
    {
      case Chemistry.GasType.Oxygen:
      case Chemistry.GasType.LiquidOxygen:
        return 6.49214937325;
      case Chemistry.GasType.Nitrogen:
      case Chemistry.GasType.LiquidNitrogen:
        return 4.40221368946;
      case Chemistry.GasType.CarbonDioxide:
      case Chemistry.GasType.LiquidCarbonDioxide:
        return 12.195837931;
      case Chemistry.GasType.Methane:
      case Chemistry.GasType.LiquidMethane:
        return 7.8643601035;
      case Chemistry.GasType.Pollutant:
      case Chemistry.GasType.LiquidPollutant:
        return 1.31202194555;
      case Chemistry.GasType.Water:
      case Chemistry.GasType.Steam:
        return 7.90030107708;
      case Chemistry.GasType.NitrousOxide:
      case Chemistry.GasType.LiquidNitrousOxide:
        return 1.70297431874;
      case Chemistry.GasType.Hydrogen:
      case Chemistry.GasType.LiquidHydrogen:
        return 4.4843872973;
      case Chemistry.GasType.PollutedWater:
        return 8.27025711260823;
      case Chemistry.GasType.Hydrazine:
      case Chemistry.GasType.LiquidHydrazine:
        return 9.15642808045339;
      case Chemistry.GasType.LiquidAlcohol:
        return 8.3918844460789863;
      case Chemistry.GasType.Helium:
        return 0.0;
      case Chemistry.GasType.LiquidSodiumChloride:
        return 2.8774143233482707;
      case Chemistry.GasType.Silanol:
      case Chemistry.GasType.LiquidSilanol:
        return 1.5206578718752168;
      case Chemistry.GasType.HydrochloricAcid:
      case Chemistry.GasType.LiquidHydrochloricAcid:
        return 9.1088444607898627;
      case Chemistry.GasType.Ozone:
      case Chemistry.GasType.LiquidOzone:
        return 2.4097251251207226;
      default:
        throw new ArgumentOutOfRangeException(nameof (gasType), (object) gasType, (string) null);
    }
  }

  public static TemperatureKelvin EvaporationTemperature(
    Chemistry.GasType gasType,
    PressurekPa pressure)
  {
    return gasType != Chemistry.GasType.Undefined ? new TemperatureKelvin(Math.Pow(pressure.ToDouble() / MoleHelper.EvaporationCoefficientA(gasType), 1.0 / MoleHelper.EvaporationCoefficientB(gasType))) : throw new ArgumentOutOfRangeException(nameof (gasType), (object) gasType, (string) null);
  }

