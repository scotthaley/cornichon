@feature-tag
Feature: Example feature
  This is an example feature. Some details about the feature go here.
  Multiline descriptions look like this.

  @simple-tag
  Scenario: Simple scenario
    This is the scenario description
    Given I'm running a simple test
    When I pass a parameter like "<strong>banana</strong>"
    Then I should see some results


  Scenario Outline: Working scenario outline variable on first line
    When I pass a parameter like <fruit>
    Then I should see some results

    Examples:
      | fruit    |
      | "apple"  |
      | "orange" |
