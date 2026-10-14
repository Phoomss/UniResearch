import pytest


@pytest.mark.submission
def test_tc_025_author_year_prefix(e, page):
    page.login()
    selects = page.participants()
    values = {o.get_attribute("value") for o in selects[0].options}
    assert {"2", "3"} <= values and "4" not in values, (
        "TC-025: expected {'2', '3'} <= values and '4' not in values"
    )
    page.select_element(selects[0]._el, "3")
    page.recorder.capture("same-year-author-options")
    assert selects[0].first_selected_option.get_attribute("value") == "3", (
        "Same-year coauthor must be selectable through the UI"
    )
    before = e.scalar("SELECT count(*) FROM research_works")
    e.call("POST", "/research/", "S1", status=422, data=e.form(author_ids="[2,4]"))
    assert e.scalar("SELECT count(*) FROM research_works") == before, (
        "TC-025: expected e.scalar('SELECT count(*) FROM research_works') == before"
    )
