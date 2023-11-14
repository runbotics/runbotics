package com.runbotics.utils;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class XmlExtractor {

    private static final String GLOBAL_VARIABLES_INPUT_PATTERN =
        "<camunda:inputParameter\\s+name=\"globalVariables\">.*?" +
            "<camunda:list>(.*?)</camunda:list>" +
        ".*?</camunda:inputParameter>";
    private static final String VALUE_ID_PATTERN = "<camunda:value>(\\d+)</camunda:value>";

    public static List<Long> extractGlobalVariableIds(String xml) {
        List<String> values = new ArrayList<>();
        Pattern pattern = Pattern.compile(GLOBAL_VARIABLES_INPUT_PATTERN, Pattern.DOTALL);
        Matcher matcher = pattern.matcher(xml);

        while (matcher.find()) {
            collectGlobalVariableId(matcher, values);
        }
        return values.stream()
            .mapToLong(Long::parseLong)
            .boxed()
            .collect(Collectors.toList());
    }

    private static void collectGlobalVariableId(Matcher matcher, List<String> values) {
        String listContent = matcher.group(1);
        Pattern valuePattern = Pattern.compile(VALUE_ID_PATTERN);
        Matcher valueMatcher = valuePattern.matcher(listContent);
        while (valueMatcher.find()) {
            String value = valueMatcher.group(1);
            values.add(value);
        }
    }
}
