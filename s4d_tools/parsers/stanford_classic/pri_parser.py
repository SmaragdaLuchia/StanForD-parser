import pandas as pd
import numpy as np

from s4d_tools.utils.numeric_utils import safe_int, safe_float
from .constants import PRI_LOG_CODES
from .stanford_classic_base import _StanfordClassicParser
from .utils.helpers import parse_list, parse_multiline_list


class PRIParser(_StanfordClassicParser):

    def _parse_header(self):
        header_data = []
        
        creation_date = self._get_value(11, 4, '')
        modification_date = self._get_value(12, 4, '')
        valid_from_date = self._get_value(13, 4, '')
        start_date = self._get_value(16, 4, '')
        application_version_created = self._get_value(5, 1, '')

        header_data.append({
            'creation_date': creation_date,
            'modification_date': modification_date,
            'valid_from_date': valid_from_date,
            'start_date': start_date,
            'application_version_created': application_version_created
        })
        
        return pd.DataFrame(header_data)

    def _parse_machine(self):
        machine_data = []
        
        machine_id = self._get_value(3, 1, '')
        machine_base_manufacturer = self._get_value(3, 5, '')
        machine_base_model = self._get_value(3, 6, '')
        machine_serial = self._get_value(3, 7, '')
        head_model = self._get_value(3, 8, '')
        
        machine_data.append({
            'machine_id': machine_id,
            'machine_base_manufacturer': machine_base_manufacturer,
            'machine_base_model': machine_base_model,
            'machine_serial': machine_serial,
            'head_model': head_model
        })
        
        return pd.DataFrame(machine_data)

    def _parse_objects(self):
        objects_data = []
        
        contract_number = self._get_value(21, 1, '')
        contract_number_swedish = self._get_value(35, 2, '')
        operator_id = self._get_value(21, 2, '')
        site_name = self._get_value(21, 3, '')
        object_status = self._get_value(21, 5, '')

        objects_data.append({
            'contract_number': contract_number,
            'contract_number_swedish': contract_number_swedish,
            'operator_id': operator_id,
            'object_name': site_name,
            'object_status': object_status
        })
        
        return pd.DataFrame(objects_data)

    def _parse_buyer_vendor(self):
        buyer_vendor_data = []
        
        buyer_text = self._get_value(32, 1, '')
        buyer_matrix_text = self._get_value(32, 2, '')
        
        vendor_code = self._get_value(33, 2, '')
        vendor_name = self._get_value(33, 3, '')
        vendor_address = self._get_value(33, 4, '')
        vendor_email = self._get_value(33, 5, '')
        vendor_phone = self._get_value(33, 6, '')
        
        subcontractor_code = self._get_value(34, 2, '')
        subcontractor_name = self._get_value(34, 3, '')
        subcontractor_address = self._get_value(34, 4, '')
        subcontractor_email = self._get_value(34, 5, '')
        subcontractor_phone = self._get_value(34, 6, '')
        
        buyer_vendor_data.append({
            'buyer_text': buyer_text,
            'buyer_matrix_text': buyer_matrix_text,
            'vendor_code': vendor_code,
            'vendor_name': vendor_name,
            'vendor_address': vendor_address,
            'vendor_email': vendor_email,
            'vendor_phone': vendor_phone,
            'subcontractor_code': subcontractor_code,
            'subcontractor_name': subcontractor_name,
            'subcontractor_address': subcontractor_address,
            'subcontractor_email': subcontractor_email,
            'subcontractor_phone': subcontractor_phone
        })
        
        return pd.DataFrame(buyer_vendor_data)

    def _parse_calibration(self):
        calibration_data = []
        
        num_length_cal = self._get_value(40, 1, '0')
        num_length_cal_per_species = parse_list(self._get_value(40, 2, ''))
        num_length_positions = parse_list(self._get_value(40, 3, ''))
        
        length_cal_dates = parse_multiline_list(self._get_value(41, 4, ''))
        length_cal_reasons = parse_multiline_list(self._get_value(42, 1, ''))
        length_cal_reason_codes = parse_list(self._get_value(42, 2, ''))
        length_positions = parse_list(self._get_value(46, 1, ''))
        length_corrections = parse_list(self._get_value(47, 1, ''))
        length_corrections_butt = parse_list(self._get_value(47, 2, ''))

        num_diameter_cal = self._get_value(43, 1, '0')
        num_diameter_cal_per_species = parse_list(self._get_value(43, 2, ''))
        num_diameter_positions = parse_list(self._get_value(43, 3, ''))
        
        diameter_cal_dates = parse_multiline_list(self._get_value(44, 4, ''))
        diameter_cal_reasons = parse_multiline_list(self._get_value(45, 1, ''))
        diameter_cal_reason_codes = parse_list(self._get_value(45, 2, ''))
        diameter_positions = parse_list(self._get_value(48, 1, ''))
        diameter_corrections = parse_list(self._get_value(49, 1, ''))
        diameter_correction_a = parse_list(self._get_value(49, 2, ''), float)
        diameter_correction_b = parse_list(self._get_value(49, 3, ''), float)
        
        calibration_data.append({
            'num_length_calibrations': safe_int(num_length_cal, 0),
            'num_length_cal_per_species': num_length_cal_per_species,
            'num_length_positions': num_length_positions,
            'length_cal_dates': length_cal_dates,
            'length_cal_reasons': length_cal_reasons,
            'length_cal_reason_codes': length_cal_reason_codes,
            'length_positions_cm': length_positions,
            'length_corrections_mm': length_corrections,
            'length_corrections_butt_mm': length_corrections_butt,
            'num_diameter_calibrations': safe_int(num_diameter_cal, 0),
            'num_diameter_cal_per_species': num_diameter_cal_per_species,
            'num_diameter_positions': num_diameter_positions,
            'diameter_cal_dates': diameter_cal_dates,
            'diameter_cal_reasons': diameter_cal_reasons,
            'diameter_cal_reason_codes': diameter_cal_reason_codes,
            'diameter_positions_mm': diameter_positions,
            'diameter_corrections_mm': diameter_corrections,
            'diameter_correction_a': diameter_correction_a,
            'diameter_correction_b': diameter_correction_b
        })
        
        return pd.DataFrame(calibration_data)

    def _parse_apt_history(self):
        apt_history_data = []
        
        num_changes = self._get_value(51, 1, '0')
        change_dates = parse_multiline_list(self._get_value(51, 2, ''))
        change_variables = parse_multiline_list(self._get_value(51, 3, ''))
        change_machine_ids = parse_multiline_list(self._get_value(51, 4, ''))
        last_reset_date = self._get_value(51, 5, '')
        reset_signature = self._get_value(51, 6, '')
        
        apt_history_data.append({
            'num_changes': safe_int(num_changes, 0),
            'change_dates': change_dates,
            'change_variables': change_variables,
            'change_machine_ids': change_machine_ids,
            'last_reset_date': last_reset_date,
            'reset_signature': reset_signature
        })
        
        return pd.DataFrame(apt_history_data)

    def _parse_species_groups(self):
        species_groups_data = []
        
        num_species = self._get_value(111, 1, '0')
        species_names = parse_multiline_list(self._get_value(120, 1, ''))
        species_codes = parse_list(self._get_value(120, 3, ''))

        num_bark_params = parse_list(self._get_value(112, 1, ''))
        num_diameter_breaks = parse_list(self._get_value(112, 2, ''))

        bark_params = parse_list(self._get_value(113, 1, ''))
        diameter_limits = parse_list(self._get_value(113, 2, ''))
        bark_deductions = parse_list(self._get_value(113, 3, ''))
        bark_latitude = self._get_value(113, 4, '')
        bark_function_type = parse_list(self._get_value(113, 7, ''))
        
        num_species_int = safe_int(num_species, len(species_names))
        for i in range(num_species_int):
            species_groups_data.append({
                'species_group_key': str(species_codes[i]) if i < len(species_codes) else str(i+1),
                'species_group_name': species_names[i] if i < len(species_names) else '',
                'species_code': species_codes[i] if i < len(species_codes) else '',
                'num_bark_params': num_bark_params[i] if i < len(num_bark_params) else 0,
                'num_diameter_breaks': num_diameter_breaks[i] if i < len(num_diameter_breaks) else 0,
                'bark_function_type': bark_function_type[i] if i < len(bark_function_type) else 0
            })
        
        return pd.DataFrame(species_groups_data)

    def _parse_products(self):
        products_data = []
        
        num_species = self._get_value(111, 1, '0')
        num_species_int = safe_int(num_species, 0)

        num_assortments = parse_list(self._get_value(116, 1, ''))

        product_names = parse_multiline_list(self._get_value(121, 1, ''))
        product_codes = parse_multiline_list(self._get_value(121, 2, ''))
        product_additional_ids = parse_multiline_list(self._get_value(121, 3, ''))
        product_modify_dates = parse_multiline_list(self._get_value(121, 4, ''))
        product_additional_info = parse_multiline_list(self._get_value(121, 5, ''))
        product_unique_ids = parse_list(self._get_value(121, 6, ''))

        num_diameter_classes = parse_list(self._get_value(117, 1, ''))
        num_length_classes = parse_list(self._get_value(118, 1, ''))
        product_group_numbers = parse_list(self._get_value(126, 1, ''))
        
        product_idx = 0
        for species_idx in range(num_species_int):
            num_assortments_for_species = num_assortments[species_idx] if species_idx < len(num_assortments) else 0
            for _ in range(num_assortments_for_species):
                if product_idx < len(product_names):
                    products_data.append({
                        'product_key': str(product_idx + 1),
                        'product_name': product_names[product_idx],
                        'product_code': product_codes[product_idx] if product_idx < len(product_codes) else '',
                        'species_group_key': str(species_idx + 1),
                        'product_additional_id': product_additional_ids[product_idx] if product_idx < len(product_additional_ids) else '',
                        'product_modification_date': product_modify_dates[product_idx] if product_idx < len(product_modify_dates) else '',
                        'product_additional_info': product_additional_info[product_idx] if product_idx < len(product_additional_info) else '',
                        'product_unique_id': product_unique_ids[product_idx] if product_idx < len(product_unique_ids) else '',
                        'num_diameter_classes': num_diameter_classes[product_idx] if product_idx < len(num_diameter_classes) else 0,
                        'num_length_classes': num_length_classes[product_idx] if product_idx < len(num_length_classes) else 0,
                        'product_group_number': product_group_numbers[product_idx] if product_idx < len(product_group_numbers) else 0
                    })
                    product_idx += 1
        
        return pd.DataFrame(products_data)

    def _parse_price_matrix(self):
        price_matrix_data = []

        diameter_limits = parse_list(self._get_value(131, 1, ''))
        diameter_class_names = parse_multiline_list(self._get_value(131, 2, ''))

        length_limits = parse_list(self._get_value(132, 1, ''))

        grades = parse_list(self._get_value(141, 1, ''))
        num_grades_used = self._get_value(142, 1, '0')
        grade_descriptions = parse_multiline_list(self._get_value(143, 1, ''))

        price_categories = parse_list(self._get_value(161, 1, ''))

        density_ub = parse_list(self._get_value(169, 1, ''))
        density_ob = parse_list(self._get_value(169, 2, ''))
        
        price_matrix_data.append({
            'diameter_limits_mm': diameter_limits,
            'diameter_class_names': diameter_class_names,
            'length_limits_cm': length_limits,
            'grades': grades,
            'num_grades_used': safe_int(num_grades_used, 0),
            'grade_descriptions': grade_descriptions,
            'price_categories': price_categories,
            'density_ub_kg_m3': density_ub,
            'density_ob_kg_m3': density_ob
        })
        
        return pd.DataFrame(price_matrix_data)

    def _parse_operators(self):
        operators_data = []
        
        num_operators = self._get_value(211, 2, '0')
        operator_names = parse_multiline_list(self._get_value(212, 1, ''))
        
        num_operators_int = safe_int(num_operators, len(operator_names))
        for i in range(num_operators_int):
            operators_data.append({
                'operator_key': str(i + 1),
                'operator_name': operator_names[i] if i < len(operator_names) else ''
            })
        
        return pd.DataFrame(operators_data)

    def _parse_production_statistics(self):
        statistics_data = []

        num_stems = self._get_value(221, 1, '0')
        total_stems_site = self._get_value(221, 2, '0')

        num_multi_tree_occasions = self._get_value(230, 2, '0')
        num_multi_tree_stems = self._get_value(231, 2, '0')
        num_multi_tree_occasions_per_operator = parse_list(self._get_value(230, 3, ''))
        num_multi_tree_stems_per_operator = parse_list(self._get_value(231, 3, ''))
        num_multi_tree_occasions_measured = self._get_value(230, 4, '0')
        num_stem_bunches = self._get_value(230, 5, '0')

        total_merchantable_volume = parse_list(self._get_value(241, 5, ''))

        estimated_logs_bunched = self._get_value(246, 8, '0')
        total_log_bunches_site = self._get_value(246, 9, '0')
        num_log_bunches = self._get_value(246, 10, '0')

        num_logs = self._get_value(290, 1, '0')
        total_logs_site = self._get_value(290, 2, '0')

        distance_covered = self._get_value(258, 1, '0')
        if isinstance(distance_covered, list):
            distance_covered = distance_covered[0] if distance_covered else '0'
        distance_per_operator = parse_list(self._get_value(258, 2, ''))

        statistics_data.append({
            'num_stems': safe_int(num_stems, 0),
            'total_stems_site': safe_int(total_stems_site, 0),
            'num_multi_tree_occasions': safe_int(num_multi_tree_occasions, 0),
            'num_multi_tree_stems': safe_int(num_multi_tree_stems, 0),
            'num_multi_tree_occasions_measured': safe_int(num_multi_tree_occasions_measured, 0),
            'num_stem_bunches': safe_int(num_stem_bunches, 0),
            'total_merchantable_volume_m3_ub': total_merchantable_volume,
            'estimated_logs_bunched': safe_int(estimated_logs_bunched, 0),
            'total_log_bunches_site': safe_int(total_log_bunches_site, 0),
            'num_log_bunches': safe_int(num_log_bunches, 0),
            'num_logs': safe_int(num_logs, 0),
            'total_logs_site': safe_int(total_logs_site, 0),
            'distance_covered_km': safe_float(distance_covered, 0.0),
            'distance_per_operator_km': distance_per_operator
        })
        
        return pd.DataFrame(statistics_data)

    def _parse_log_codes(self):
        log_codes_data = []
        
        num_log_codes = self._get_value(255, 1, '0')
        num_downgrade_codes = self._get_value(255, 2, '0')
        num_multi_tree_codes = self._get_value(255, 3, '0')
        
        log_codes = parse_list(self._get_value(256, 1, ''))
        downgrade_codes = parse_list(self._get_value(256, 2, ''))
        multi_tree_codes = parse_list(self._get_value(256, 3, ''))
        
        num_log_data = self._get_value(257, 1, '0')
        num_multi_tree_log_data = self._get_value(257, 2, '0')
        
        log_codes_data.append({
            'num_log_codes': safe_int(num_log_codes, 0),
            'num_downgrade_codes': safe_int(num_downgrade_codes, 0),
            'num_multi_tree_codes': safe_int(num_multi_tree_codes, 0),
            'log_codes': log_codes,
            'downgrade_codes': downgrade_codes,
            'multi_tree_codes': multi_tree_codes,
            'num_log_data_fields': safe_int(num_log_data, 0),
            'num_multi_tree_log_data_fields': safe_int(num_multi_tree_log_data, 0)
        })
        
        return pd.DataFrame(log_codes_data)

    def _parse_tree_codes(self):
        tree_codes_data = []
        
        num_tree_codes = self._get_value(265, 1, '0')
        num_multi_tree_codes = self._get_value(265, 2, '0')
        num_multi_felling_codes = self._get_value(265, 3, '0')
        
        tree_codes = parse_list(self._get_value(266, 1, ''))
        multi_tree_codes = parse_list(self._get_value(266, 2, ''))
        multi_felling_codes = parse_list(self._get_value(266, 3, ''))
        
        num_tree_data = self._get_value(267, 1, '0')
        num_multi_tree_data = self._get_value(267, 2, '0')
        num_multi_felling_data = self._get_value(267, 3, '0')
        
        tree_codes_data.append({
            'num_tree_codes': safe_int(num_tree_codes, 0),
            'num_multi_tree_codes': safe_int(num_multi_tree_codes, 0),
            'num_multi_felling_codes': safe_int(num_multi_felling_codes, 0),
            'tree_codes': tree_codes,
            'multi_tree_codes': multi_tree_codes,
            'multi_felling_codes': multi_felling_codes,
            'num_tree_data_fields': safe_int(num_tree_data, 0),
            'num_multi_tree_data_fields': safe_int(num_multi_tree_data, 0),
            'num_multi_felling_data_fields': safe_int(num_multi_felling_data, 0)
        })
        
        return pd.DataFrame(tree_codes_data)

    def _parse_additional_info(self):
        additional_data = []

        optional_text_to_machine = self._get_value(200, 2, '')
        optional_text_from_machine = self._get_value(200, 3, '')

        dbh_height = parse_list(self._get_value(500, 1, ''))
        dbh_derivation_distance = parse_list(self._get_value(510, 1, ''))

        coord_ref_position = self._get_value(520, 1, '')
        coord_type = self._get_value(521, 1, '')
        coord_system = self._get_value(521, 2, '')

        coord_start_latitude = self._get_value(522, 1, '')
        coord_start_lat_direction = self._get_value(522, 2, '')
        coord_start_longitude = self._get_value(522, 3, '')
        coord_start_lon_direction = self._get_value(522, 4, '')
        coord_start_altitude = self._get_value(522, 5, '')
        coord_start_datetime = self._get_value(522, 6, '')

        butt_diam_method = parse_list(self._get_value(170, 1, ''))

        apteri_text = self._get_value(605, 1, '')
        apteri_datetime = self._get_value(605, 2, '')

        stand_age_mean = self._get_value(660, 1, '')
        stand_age_std_dev = self._get_value(660, 2, '')
        
        additional_data.append({
            'optional_text_to_machine': optional_text_to_machine,
            'optional_text_from_machine': optional_text_from_machine,
            'dbh_height_cm': dbh_height,
            'dbh_derivation_distance_cm': dbh_derivation_distance,
            'coord_ref_position': coord_ref_position,
            'coord_type': coord_type,
            'coord_system': coord_system,
            'coord_start_latitude': coord_start_latitude,
            'coord_start_lat_direction': coord_start_lat_direction,
            'coord_start_longitude': coord_start_longitude,
            'coord_start_lon_direction': coord_start_lon_direction,
            'coord_start_altitude_m': coord_start_altitude,
            'coord_start_datetime': coord_start_datetime,
            'butt_diam_method': butt_diam_method,
            'apteri_text': apteri_text,
            'apteri_datetime': apteri_datetime,
            'stand_age_mean_years': stand_age_mean,
            'stand_age_std_dev_years': stand_age_std_dev
        })
        
        return pd.DataFrame(additional_data)

    def _parse_logs(self):
        num_log_codes = self._get_value(255, 1, '0')
        log_codes_str = self._get_value(256, 1, '')
        log_data_str = self._get_value(257, 1, '')
        num_logs = self._get_value(290, 2, '0')
        
        if not log_codes_str or not log_data_str:
            return pd.DataFrame()
        
        try:
            num_log_codes_int = safe_int(num_log_codes, 0)
            num_logs_int = safe_int(num_logs, 0)
            
            if num_log_codes_int == 0 or num_logs_int == 0:
                return pd.DataFrame()
            
            log_codes = parse_list(log_codes_str, int)
            log_data = parse_list(log_data_str, int)
            
            if len(log_codes) != num_log_codes_int:
                return pd.DataFrame()
            
            expected_data_length = num_logs_int * num_log_codes_int
            if len(log_data) != expected_data_length:
                return pd.DataFrame()

            log_array = np.array(log_data).reshape(num_logs_int, num_log_codes_int)

            known_indices = [idx for idx, code in enumerate(log_codes) if code in PRI_LOG_CODES]
            if not known_indices:
                return pd.DataFrame()

            column_names = [PRI_LOG_CODES[log_codes[idx]] for idx in known_indices]
            filtered_log_array = log_array[:, known_indices]
            logs_df = pd.DataFrame(filtered_log_array, columns=column_names)
            
            return logs_df
            
        except (ValueError, IndexError):
            return pd.DataFrame()

    def parse(self):
        self._load_raw_data()

        return {
            'header': self._parse_header(),
            'machine': self._parse_machine(),
            'objects': self._parse_objects(),
            'buyer_vendor': self._parse_buyer_vendor(),
            'calibration': self._parse_calibration(),
            'apt_history': self._parse_apt_history(),
            'species_groups': self._parse_species_groups(),
            'products': self._parse_products(),
            'price_matrix': self._parse_price_matrix(),
            'operators': self._parse_operators(),
            'production_statistics': self._parse_production_statistics(),
            'log_codes': self._parse_log_codes(),
            'tree_codes': self._parse_tree_codes(),
            'additional_info': self._parse_additional_info(),
            'logs': self._parse_logs()
        }
