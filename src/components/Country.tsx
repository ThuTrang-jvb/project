import React, { useState, useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import "../components/Country.css"
interface Country {
    iso_3166_1: string
    english_name: string
    native_name: string
}

const CountryDropdown = (): React.ReactElement => {
    const location = useLocation()
    const isCountry = location.pathname.startsWith("/country")
    const [countries, setCountries] = useState<Country[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const toggleDropdown = () => setIsOpen(!isOpen)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        const mockCountries: Country[] = [
            { "iso_3166_1": "AD", "english_name": "Andorra", "native_name": "Andorra" },
            { "iso_3166_1": "AE", "english_name": "United Arab Emirates", "native_name": "United Arab Emirates" },
            { "iso_3166_1": "AF", "english_name": "Afghanistan", "native_name": "Afghanistan" },
            { "iso_3166_1": "AG", "english_name": "Antigua and Barbuda", "native_name": "Antigua & Barbuda" },
            { "iso_3166_1": "AI", "english_name": "Anguilla", "native_name": "Anguilla" },
            { "iso_3166_1": "AL", "english_name": "Albania", "native_name": "Albania" },
            { "iso_3166_1": "AM", "english_name": "Armenia", "native_name": "Armenia" },
            { "iso_3166_1": "AN", "english_name": "Netherlands Antilles", "native_name": "Netherlands Antilles" },
            { "iso_3166_1": "AO", "english_name": "Angola", "native_name": "Angola" },
            { "iso_3166_1": "AQ", "english_name": "Antarctica", "native_name": "Antarctica" },
            { "iso_3166_1": "AR", "english_name": "Argentina", "native_name": "Argentina" },
            { "iso_3166_1": "AS", "english_name": "American Samoa", "native_name": "American Samoa" },
            { "iso_3166_1": "AT", "english_name": "Austria", "native_name": "Austria" },
            { "iso_3166_1": "AU", "english_name": "Australia", "native_name": "Australia" },
            { "iso_3166_1": "AW", "english_name": "Aruba", "native_name": "Aruba" },
            { "iso_3166_1": "AZ", "english_name": "Azerbaijan", "native_name": "Azerbaijan" },
            { "iso_3166_1": "BA", "english_name": "Bosnia and Herzegovina", "native_name": "Bosnia & Herzegovina" },
            { "iso_3166_1": "BB", "english_name": "Barbados", "native_name": "Barbados" },
            { "iso_3166_1": "BD", "english_name": "Bangladesh", "native_name": "Bangladesh" },
            { "iso_3166_1": "BE", "english_name": "Belgium", "native_name": "Belgium" },
            { "iso_3166_1": "BF", "english_name": "Burkina Faso", "native_name": "Burkina Faso" },
            { "iso_3166_1": "BG", "english_name": "Bulgaria", "native_name": "Bulgaria" },
            { "iso_3166_1": "BH", "english_name": "Bahrain", "native_name": "Bahrain" },
            { "iso_3166_1": "BI", "english_name": "Burundi", "native_name": "Burundi" },
            { "iso_3166_1": "BJ", "english_name": "Benin", "native_name": "Benin" },
            { "iso_3166_1": "BM", "english_name": "Bermuda", "native_name": "Bermuda" },
            { "iso_3166_1": "BN", "english_name": "Brunei Darussalam", "native_name": "Brunei" },
            { "iso_3166_1": "BO", "english_name": "Bolivia", "native_name": "Bolivia" },
            { "iso_3166_1": "BR", "english_name": "Brazil", "native_name": "Brazil" },
            { "iso_3166_1": "BS", "english_name": "Bahamas", "native_name": "Bahamas" },
            { "iso_3166_1": "BT", "english_name": "Bhutan", "native_name": "Bhutan" },
            { "iso_3166_1": "BU", "english_name": "Burma", "native_name": "Burma" },
            { "iso_3166_1": "BV", "english_name": "Bouvet Island", "native_name": "Bouvet Island" },
            { "iso_3166_1": "BW", "english_name": "Botswana", "native_name": "Botswana" },
            { "iso_3166_1": "BY", "english_name": "Belarus", "native_name": "Belarus" },
            { "iso_3166_1": "BZ", "english_name": "Belize", "native_name": "Belize" },
            { "iso_3166_1": "CA", "english_name": "Canada", "native_name": "Canada" },
            { "iso_3166_1": "CC", "english_name": "Cocos  Islands", "native_name": "Cocos (Keeling) Islands" },
            { "iso_3166_1": "CD", "english_name": "Congo", "native_name": "Democratic Republic of the Congo (Kinshasa)" },
            { "iso_3166_1": "CF", "english_name": "Central African Republic", "native_name": "Central African Republic" },
            { "iso_3166_1": "CG", "english_name": "Congo", "native_name": "Republic of the Congo (Brazzaville)" },
            { "iso_3166_1": "CH", "english_name": "Switzerland", "native_name": "Switzerland" },
            { "iso_3166_1": "CI", "english_name": "Cote D'Ivoire", "native_name": "Côte d’Ivoire" },
            { "iso_3166_1": "CK", "english_name": "Cook Islands", "native_name": "Cook Islands" },
            { "iso_3166_1": "CL", "english_name": "Chile", "native_name": "Chile" },
            { "iso_3166_1": "CM", "english_name": "Cameroon", "native_name": "Cameroon" },
            { "iso_3166_1": "CN", "english_name": "China", "native_name": "China" },
            { "iso_3166_1": "CO", "english_name": "Colombia", "native_name": "Colombia" },
            { "iso_3166_1": "CR", "english_name": "Costa Rica", "native_name": "Costa Rica" },
            { "iso_3166_1": "CS", "english_name": "Serbia and Montenegro", "native_name": "Serbia and Montenegro" },
            { "iso_3166_1": "CU", "english_name": "Cuba", "native_name": "Cuba" },
            { "iso_3166_1": "CV", "english_name": "Cape Verde", "native_name": "Cape Verde" },
            { "iso_3166_1": "CX", "english_name": "Christmas Island", "native_name": "Christmas Island" },
            { "iso_3166_1": "CY", "english_name": "Cyprus", "native_name": "Cyprus" },
            { "iso_3166_1": "CZ", "english_name": "Czech Republic", "native_name": "Czech Republic" },
            { "iso_3166_1": "DE", "english_name": "Germany", "native_name": "Germany" },
            { "iso_3166_1": "DJ", "english_name": "Djibouti", "native_name": "Djibouti" },
            { "iso_3166_1": "DK", "english_name": "Denmark", "native_name": "Denmark" },
            { "iso_3166_1": "DM", "english_name": "Dominica", "native_name": "Dominica" },
            { "iso_3166_1": "DO", "english_name": "Dominican Republic", "native_name": "Dominican Republic" },
            { "iso_3166_1": "DZ", "english_name": "Algeria", "native_name": "Algeria" },
            { "iso_3166_1": "EC", "english_name": "Ecuador", "native_name": "Ecuador" },
            { "iso_3166_1": "EE", "english_name": "Estonia", "native_name": "Estonia" },
            { "iso_3166_1": "EG", "english_name": "Egypt", "native_name": "Egypt" },
            { "iso_3166_1": "EH", "english_name": "Western Sahara", "native_name": "Western Sahara" },
            { "iso_3166_1": "ER", "english_name": "Eritrea", "native_name": "Eritrea" },
            { "iso_3166_1": "ES", "english_name": "Spain", "native_name": "Spain" },
            { "iso_3166_1": "ET", "english_name": "Ethiopia", "native_name": "Ethiopia" },
            { "iso_3166_1": "FI", "english_name": "Finland", "native_name": "Finland" },
            { "iso_3166_1": "FJ", "english_name": "Fiji", "native_name": "Fiji" },
            { "iso_3166_1": "FK", "english_name": "Falkland Islands", "native_name": "Falkland Islands" },
            { "iso_3166_1": "FM", "english_name": "Micronesia", "native_name": "Micronesia" },
            { "iso_3166_1": "FO", "english_name": "Faeroe Islands", "native_name": "Faroe Islands" },
            { "iso_3166_1": "FR", "english_name": "France", "native_name": "France" },
            { "iso_3166_1": "GA", "english_name": "Gabon", "native_name": "Gabon" },
            { "iso_3166_1": "GB", "english_name": "United Kingdom", "native_name": "United Kingdom" },
            { "iso_3166_1": "GD", "english_name": "Grenada", "native_name": "Grenada" },
            { "iso_3166_1": "GE", "english_name": "Georgia", "native_name": "Georgia" },
            { "iso_3166_1": "GF", "english_name": "French Guiana", "native_name": "French Guiana" },
            { "iso_3166_1": "GH", "english_name": "Ghana", "native_name": "Ghana" }, 
            {"iso_3166_1": "GI", "english_name": "Gibraltar", "native_name": "Gibraltar"},
            { "iso_3166_1": "GL", "english_name": "Greenland", "native_name": "Greenland" },
            { "iso_3166_1": "GM", "english_name": "Gambia", "native_name": "Gambia" },
            { "iso_3166_1": "GN", "english_name": "Guinea", "native_name": "Guinea" },
            { "iso_3166_1": "GP", "english_name": "Guadaloupe", "native_name": "Guadeloupe" },
            { "iso_3166_1": "GQ", "english_name": "Equatorial Guinea", "native_name": "Equatorial Guinea" },
            { "iso_3166_1": "GR", "english_name": "Greece", "native_name": "Greece" },
            { "iso_3166_1": "GS", "english_name": "South Georgia and the South Sandwich Islands", "native_name": "South Georgia & South Sandwich Islands" },
            { "iso_3166_1": "GT", "english_name": "Guatemala", "native_name": "Guatemala" },
            { "iso_3166_1": "GU", "english_name": "Guam", "native_name": "Guam" },
            { "iso_3166_1": "GW", "english_name": "Guinea-Bissau", "native_name": "Guinea-Bissau" },
            { "iso_3166_1": "GY", "english_name": "Guyana", "native_name": "Guyana" },
            { "iso_3166_1": "HK", "english_name": "Hong Kong", "native_name": "Hong Kong SAR China" },
            { "iso_3166_1": "HM", "english_name": "Heard and McDonald Islands", "native_name": "Heard & McDonald Islands" },
            { "iso_3166_1": "HN", "english_name": "Honduras", "native_name": "Honduras" },
            { "iso_3166_1": "HR", "english_name": "Croatia", "native_name": "Croatia" },
            { "iso_3166_1": "HT", "english_name": "Haiti", "native_name": "Haiti" },
            { "iso_3166_1": "HU", "english_name": "Hungary", "native_name": "Hungary" },
            { "iso_3166_1": "ID", "english_name": "Indonesia", "native_name": "Indonesia" },
            { "iso_3166_1": "IE", "english_name": "Ireland", "native_name": "Ireland" },
            { "iso_3166_1": "IL", "english_name": "Israel", "native_name": "Israel" },
            { "iso_3166_1": "IN", "english_name": "India", "native_name": "India" },
            { "iso_3166_1": "IO", "english_name": "British Indian Ocean Territory", "native_name": "British Indian Ocean Territory" },
            { "iso_3166_1": "IQ", "english_name": "Iraq", "native_name": "Iraq" },
            { "iso_3166_1": "IR", "english_name": "Iran", "native_name": "Iran" },
            { "iso_3166_1": "IS", "english_name": "Iceland", "native_name": "Iceland" },
            { "iso_3166_1": "IT", "english_name": "Italy", "native_name": "Italy" },
            { "iso_3166_1": "JM", "english_name": "Jamaica", "native_name": "Jamaica" },
            { "iso_3166_1": "JO", "english_name": "Jordan", "native_name": "Jordan" },
            { "iso_3166_1": "JP", "english_name": "Japan", "native_name": "Japan" },
            { "iso_3166_1": "KE", "english_name": "Kenya", "native_name": "Kenya" },
            { "iso_3166_1": "KG", "english_name": "Kyrgyz Republic", "native_name": "Kyrgyzstan" },
            { "iso_3166_1": "KH", "english_name": "Cambodia", "native_name": "Cambodia" },
            { "iso_3166_1": "KI", "english_name": "Kiribati", "native_name": "Kiribati" },
            { "iso_3166_1": "KM", "english_name": "Comoros", "native_name": "Comoros" },
            { "iso_3166_1": "KN", "english_name": "St. Kitts and Nevis", "native_name": "St. Kitts & Nevis" },
            { "iso_3166_1": "KP", "english_name": "North Korea", "native_name": "North Korea" },
            { "iso_3166_1": "KR", "english_name": "South Korea", "native_name": "South Korea" },
            { "iso_3166_1": "KW", "english_name": "Kuwait", "native_name": "Kuwait" },
            { "iso_3166_1": "KY", "english_name": "Cayman Islands", "native_name": "Cayman Islands" },
            { "iso_3166_1": "KZ", "english_name": "Kazakhstan", "native_name": "Kazakhstan" },
            { "iso_3166_1": "LA", "english_name": "Lao People's Democratic Republic", "native_name": "Laos" },
            { "iso_3166_1": "LB", "english_name": "Lebanon", "native_name": "Lebanon" },
            { "iso_3166_1": "LC", "english_name": "St. Lucia", "native_name": "St. Lucia" },
            { "iso_3166_1": "LI", "english_name": "Liechtenstein", "native_name": "Liechtenstein" },
            { "iso_3166_1": "LK", "english_name": "Sri Lanka", "native_name": "Sri Lanka" },
            { "iso_3166_1": "LR", "english_name": "Liberia", "native_name": "Liberia" },
            { "iso_3166_1": "LS", "english_name": "Lesotho", "native_name": "Lesotho" },
            { "iso_3166_1": "LT", "english_name": "Lithuania", "native_name": "Lithuania" },
            { "iso_3166_1": "LU", "english_name": "Luxembourg", "native_name": "Luxembourg" },
            { "iso_3166_1": "LV", "english_name": "Latvia", "native_name": "Latvia" },
            { "iso_3166_1": "LY", "english_name": "Libyan Arab Jamahiriya", "native_name": "Libya" },
            { "iso_3166_1": "MA", "english_name": "Morocco", "native_name": "Morocco" },
            { "iso_3166_1": "MC", "english_name": "Monaco", "native_name": "Monaco" },
            { "iso_3166_1": "MD", "english_name": "Moldova", "native_name": "Moldova" },
            { "iso_3166_1": "ME", "english_name": "Montenegro", "native_name": "Montenegro" },
            { "iso_3166_1": "MG", "english_name": "Madagascar", "native_name": "Madagascar" },
            { "iso_3166_1": "MH", "english_name": "Marshall Islands", "native_name": "Marshall Islands" },
            { "iso_3166_1": "MK", "english_name": "Macedonia", "native_name": "Macedonia" },
            { "iso_3166_1": "ML", "english_name": "Mali", "native_name": "Mali" },
            { "iso_3166_1": "MM", "english_name": "Myanmar", "native_name": "Myanmar (Burma)" },
            { "iso_3166_1": "MN", "english_name": "Mongolia", "native_name": "Mongolia" },
            { "iso_3166_1": "MO", "english_name": "Macao", "native_name": "Macau SAR China" },
            { "iso_3166_1": "MP", "english_name": "Northern Mariana Islands", "native_name": "Northern Mariana Islands" },
            { "iso_3166_1": "MQ", "english_name": "Martinique", "native_name": "Martinique" },
            { "iso_3166_1": "MR", "english_name": "Mauritania", "native_name": "Mauritania" },
            { "iso_3166_1": "MS", "english_name": "Montserrat", "native_name": "Montserrat" },
            { "iso_3166_1": "MT", "english_name": "Malta", "native_name": "Malta" },
            { "iso_3166_1": "MU", "english_name": "Mauritius", "native_name": "Mauritius" },
            { "iso_3166_1": "MV", "english_name": "Maldives", "native_name": "Maldives" },
            { "iso_3166_1": "MW", "english_name": "Malawi", "native_name": "Malawi" },
            { "iso_3166_1": "MX", "english_name": "Mexico", "native_name": "Mexico" },
            { "iso_3166_1": "MY", "english_name": "Malaysia", "native_name": "Malaysia" },
            { "iso_3166_1": "MZ", "english_name": "Mozambique", "native_name": "Mozambique" },
            { "iso_3166_1": "NA", "english_name": "Namibia", "native_name": "Namibia" },
            { "iso_3166_1": "NC", "english_name": "New Caledonia", "native_name": "New Caledonia" },
            { "iso_3166_1": "NE", "english_name": "Niger", "native_name": "Niger" },
            { "iso_3166_1": "NF", "english_name": "Norfolk Island", "native_name": "Norfolk Island" },
            { "iso_3166_1": "NG", "english_name": "Nigeria", "native_name": "Nigeria" },
            { "iso_3166_1": "NI", "english_name": "Nicaragua", "native_name": "Nicaragua" },
            { "iso_3166_1": "NL", "english_name": "Netherlands", "native_name": "Netherlands" },
            { "iso_3166_1": "NO", "english_name": "Norway", "native_name": "Norway" },
            { "iso_3166_1": "NP", "english_name": "Nepal", "native_name": "Nepal" },
            { "iso_3166_1": "NR", "english_name": "Nauru", "native_name": "Nauru" },
            { "iso_3166_1": "NU", "english_name": "Niue", "native_name": "Niue" },
            { "iso_3166_1": "NZ", "english_name": "New Zealand", "native_name": "New Zealand" },
            { "iso_3166_1": "OM", "english_name": "Oman", "native_name": "Oman" },
            { "iso_3166_1": "PA", "english_name": "Panama", "native_name": "Panama" },
            { "iso_3166_1": "PE", "english_name": "Peru", "native_name": "Peru" }, 
            { "iso_3166_1": "PF", "english_name": "French Polynesia", "native_name": "French Polynesia" },
            { "iso_3166_1": "PG", "english_name": "Papua New Guinea", "native_name": "Papua New Guinea" }, 
            { "iso_3166_1": "PH", "english_name": "Philippines", "native_name": "Philippines" },
            { "iso_3166_1": "PK", "english_name": "Pakistan", "native_name": "Pakistan" },
            { "iso_3166_1": "PL", "english_name": "Poland", "native_name": "Poland" }, 
            { "iso_3166_1": "PM", "english_name": "St. Pierre and Miquelon", "native_name": "St. Pierre & Miquelon" },
            { "iso_3166_1": "PN", "english_name": "Pitcairn Island", "native_name": "Pitcairn Islands" },
            { "iso_3166_1": "PR", "english_name": "Puerto Rico", "native_name": "Puerto Rico" },
            { "iso_3166_1": "PS", "english_name": "Palestinian Territory", "native_name": "Palestinian Territories" },
            { "iso_3166_1": "PT", "english_name": "Portugal", "native_name": "Portugal" }, 
            { "iso_3166_1": "PW", "english_name": "Palau", "native_name": "Palau" },
            { "iso_3166_1": "PY", "english_name": "Paraguay", "native_name": "Paraguay" }, 
            { "iso_3166_1": "QA", "english_name": "Qatar", "native_name": "Qatar" }, 
            { "iso_3166_1": "RE", "english_name": "Reunion", "native_name": "Réunion" },
            { "iso_3166_1": "RO", "english_name": "Romania", "native_name": "Romania" },
            { "iso_3166_1": "RS", "english_name": "Serbia", "native_name": "Serbia" }, 
            { "iso_3166_1": "RU", "english_name": "Russia", "native_name": "Russia" }, 
            { "iso_3166_1": "RW", "english_name": "Rwanda", "native_name": "Rwanda" }, 
            { "iso_3166_1": "SA", "english_name": "Saudi Arabia", "native_name": "Saudi Arabia" },
            { "iso_3166_1": "SB", "english_name": "Solomon Islands", "native_name": "Solomon Islands" },
            { "iso_3166_1": "SC", "english_name": "Seychelles", "native_name": "Seychelles" }, 
            { "iso_3166_1": "SD", "english_name": "Sudan", "native_name": "Sudan" }, 
            { "iso_3166_1": "SE", "english_name": "Sweden", "native_name": "Sweden" }, 
            { "iso_3166_1": "SG", "english_name": "Singapore", "native_name": "Singapore" }, 
            { "iso_3166_1": "SH", "english_name": "St. Helena", "native_name": "St. Helena" }, 
            { "iso_3166_1": "SI", "english_name": "Slovenia", "native_name": "Slovenia" }, 
            { "iso_3166_1": "SJ", "english_name": "Svalbard & Jan Mayen Islands", "native_name": "Svalbard & Jan Mayen" }, 
            { "iso_3166_1": "SK", "english_name": "Slovakia", "native_name": "Slovakia" }, 
            { "iso_3166_1": "SL", "english_name": "Sierra Leone", "native_name": "Sierra Leone" }, 
            { "iso_3166_1": "SM", "english_name": "San Marino", "native_name": "San Marino" }, 
            { "iso_3166_1": "SN", "english_name": "Senegal", "native_name": "Senegal" }, 
            { "iso_3166_1": "SO", "english_name": "Somalia", "native_name": "Somalia" }, 
            { "iso_3166_1": "SR", "english_name": "Suriname", "native_name": "Suriname" }, 
            { "iso_3166_1": "SS", "english_name": "South Sudan", "native_name": "South Sudan" }, 
            { "iso_3166_1": "ST", "english_name": "Sao Tome and Principe", "native_name": "São Tomé & Príncipe" }, 
            { "iso_3166_1": "SU", "english_name": "Soviet Union", "native_name": "Soviet Union" }, 
            { "iso_3166_1": "SV", "english_name": "El Salvador", "native_name": "El Salvador" }, 
            { "iso_3166_1": "SY", "english_name": "Syrian Arab Republic", "native_name": "Syria" }, 
            { "iso_3166_1": "SZ", "english_name": "Swaziland", "native_name": "Eswatini (Swaziland)" },
            { "iso_3166_1": "TC", "english_name": "Turks and Caicos Islands", "native_name": "Turks & Caicos Islands" }, 
            { "iso_3166_1": "TD", "english_name": "Chad", "native_name": "Chad" }, 
            { "iso_3166_1": "TF", "english_name": "French Southern Territories", "native_name": "French Southern Territories" }, 
            { "iso_3166_1": "TG", "english_name": "Togo", "native_name": "Togo" }, 
            { "iso_3166_1": "TH", "english_name": "Thailand", "native_name": "Thailand" }, 
            { "iso_3166_1": "TJ", "english_name": "Tajikistan", "native_name": "Tajikistan" }, 
            { "iso_3166_1": "TK", "english_name": "Tokelau", "native_name": "Tokelau" }, 
            { "iso_3166_1": "TL", "english_name": "Timor-Leste", "native_name": "Timor-Leste" }, 
            { "iso_3166_1": "TM", "english_name": "Turkmenistan", "native_name": "Turkmenistan" }, 
            { "iso_3166_1": "TN", "english_name": "Tunisia", "native_name": "Tunisia" }, 
            { "iso_3166_1": "TO", "english_name": "Tonga", "native_name": "Tonga" }, 
            { "iso_3166_1": "TP", "english_name": "East Timor", "native_name": "East Timor" }, 
            { "iso_3166_1": "TR", "english_name": "Turkey", "native_name": "Turkey" }, 
            { "iso_3166_1": "TT", "english_name": "Trinidad and Tobago", "native_name": "Trinidad & Tobago" }, 
            { "iso_3166_1": "TV", "english_name": "Tuvalu", "native_name": "Tuvalu" }, 
            { "iso_3166_1": "TW", "english_name": "Taiwan", "native_name": "Taiwan" }, 
            { "iso_3166_1": "TZ", "english_name": "Tanzania", "native_name": "Tanzania" }, 
            { "iso_3166_1": "UA", "english_name": "Ukraine", "native_name": "Ukraine" }, 
            { "iso_3166_1": "UG", "english_name": "Uganda", "native_name": "Uganda" }, 
            { "iso_3166_1": "UM", "english_name": "United States Minor Outlying Islands", "native_name": "U.S. Outlying Islands" }, 
            { "iso_3166_1": "US", "english_name": "United States of America", "native_name": "United States" }, 
            { "iso_3166_1": "UY", "english_name": "Uruguay", "native_name": "Uruguay" }, 
            { "iso_3166_1": "UZ", "english_name": "Uzbekistan", "native_name": "Uzbekistan" }, 
            { "iso_3166_1": "VA", "english_name": "Holy See", "native_name": "Vatican City" }, 
            { "iso_3166_1": "VC", "english_name": "St. Vincent and the Grenadines", "native_name": "St. Vincent & Grenadines" }, 
            { "iso_3166_1": "VE", "english_name": "Venezuela", "native_name": "Venezuela" }, 
            { "iso_3166_1": "VG", "english_name": "British Virgin Islands", "native_name": "British Virgin Islands" }, 
            { "iso_3166_1": "VI", "english_name": "US Virgin Islands", "native_name": "U.S. Virgin Islands" }, 
            { "iso_3166_1": "VN", "english_name": "Vietnam", "native_name": "Vietnam" }, 
            { "iso_3166_1": "VU", "english_name": "Vanuatu", "native_name": "Vanuatu" }, 
            { "iso_3166_1": "WF", "english_name": "Wallis and Futuna Islands", "native_name": "Wallis & Futuna" }, 
            { "iso_3166_1": "WS", "english_name": "Samoa", "native_name": "Samoa" }, 
            { "iso_3166_1": "XC", "english_name": "Czechoslovakia", "native_name": "Czechoslovakia" }, 
            { "iso_3166_1": "XG", "english_name": "East Germany", "native_name": "East Germany" }, 
            { "iso_3166_1": "XI", "english_name": "Northern Ireland", "native_name": "Northern Ireland" }, 
            { "iso_3166_1": "XK", "english_name": "Kosovo", "native_name": "Kosovo" }, 
            { "iso_3166_1": "YE", "english_name": "Yemen", "native_name": "Yemen" }, 
            { "iso_3166_1": "YT", "english_name": "Mayotte", "native_name": "Mayotte" }, 
            { "iso_3166_1": "YU", "english_name": "Yugoslavia", "native_name": "Yugoslavia" }, 
            { "iso_3166_1": "ZA", "english_name": "South Africa", "native_name": "South Africa" }, 
            { "iso_3166_1": "ZM", "english_name": "Zambia", "native_name": "Zambia" }, 
            { "iso_3166_1": "ZR", "english_name": "Zaire", "native_name": "Zaire" }, 
            { "iso_3166_1": "ZW", "english_name": "Zimbabwe", "native_name": "Zimbabwe" }
        ]
        setCountries(mockCountries)
    }, [])

    return (
        <div className="country-dropdown" ref={dropdownRef}>
            <button
                className={`country-button nav-link ${isCountry ? "active" : ""}`}
                onClick={toggleDropdown}
            >
                Country
            </button>
            {isOpen && (
                <div className="country-dropdown-menu">
                    {countries.map((country) => (
                        <a
                            key={country.iso_3166_1}
                            href={`/country/${country.iso_3166_1}`}
                            className="country-dropdown-item"
                            onClick={() => setIsOpen(false)}
                        >
                            {country.english_name}
                            <span className="native-name"> ({country.native_name})</span>
                        </a>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CountryDropdown
